from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status

from core.database import orders_collection, vehicles_collection
from core.deps import get_current_user, require_admin
from models.order import ORDER_STATUSES, OrderCreate, OrderOut, OrderStatusUpdate
from utils.serializers import serialize_doc, to_object_id

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.get("", response_model=list[OrderOut])
async def get_my_orders(current_user: dict = Depends(get_current_user)):
    orders = await orders_collection.find({"userId": current_user["id"]}).to_list(length=None)
    return [serialize_doc(order) for order in orders]


@router.post("", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
async def create_order(payload: OrderCreate, current_user: dict = Depends(get_current_user)):
    vehicle_object_id = to_object_id(payload.vehicleId)
    if vehicle_object_id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid vehicleId")

    vehicle = await vehicles_collection.find_one({"_id": vehicle_object_id})
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    if vehicle.get("status") in ("reserved", "sold"):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"This vehicle is already {vehicle.get('status')} and cannot be reserved again",
        )

    order_doc = {
        "userId": current_user["id"],
        "vehicleId": payload.vehicleId,
        "contactName": payload.contactName,
        "contactEmail": payload.contactEmail,
        "contactPhone": payload.contactPhone,
        "notes": payload.notes,
        "status": "Pending",
        "createdAt": datetime.utcnow(),
    }
    result = await orders_collection.insert_one(order_doc)

    # Prevents double-reservation of the same "last available" unit — see PRD edge cases
    await vehicles_collection.update_one({"_id": vehicle_object_id}, {"$set": {"status": "reserved"}})

    created = await orders_collection.find_one({"_id": result.inserted_id})
    return serialize_doc(created)


@router.get("/{order_id}", response_model=OrderOut)
async def get_order(order_id: str, current_user: dict = Depends(get_current_user)):
    object_id = to_object_id(order_id)
    if object_id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid order id")

    order = await orders_collection.find_one({"_id": object_id})
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    if order["userId"] != current_user["id"] and current_user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your order")

    return serialize_doc(order)


# --- Admin-only below this point ---


@router.get("/admin/all", response_model=list[OrderOut])
async def get_all_orders(admin=Depends(require_admin)):
    orders = await orders_collection.find().to_list(length=None)
    return [serialize_doc(order) for order in orders]


@router.patch("/{order_id}/status", response_model=OrderOut)
async def update_order_status(order_id: str, payload: OrderStatusUpdate, admin=Depends(require_admin)):
    object_id = to_object_id(order_id)
    if object_id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid order id")

    order = await orders_collection.find_one({"_id": object_id})
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    # Enforces the non-skippable sequence from the PRD business rules,
    # except Cancelled, which is reachable from any pre-Completed state.
    current_index = ORDER_STATUSES.index(order["status"])
    target_index = ORDER_STATUSES.index(payload.status)
    is_valid_forward_step = target_index == current_index + 1
    is_valid_cancellation = payload.status == "Cancelled" and order["status"] != "Completed"

    if not (is_valid_forward_step or is_valid_cancellation):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot move order from '{order['status']}' to '{payload.status}' directly",
        )

    await orders_collection.update_one({"_id": object_id}, {"$set": {"status": payload.status}})
    updated = await orders_collection.find_one({"_id": object_id})
    return serialize_doc(updated)