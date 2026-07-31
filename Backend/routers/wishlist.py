from fastapi import APIRouter, Depends, HTTPException, status

from core.database import users_collection, vehicles_collection
from core.deps import get_current_user
from models.vehicle import VehicleOut
from utils.serializers import serialize_doc, to_object_id

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])


@router.get("", response_model=list[VehicleOut])
async def get_wishlist(current_user: dict = Depends(get_current_user)):
    vehicle_ids = [to_object_id(vid) for vid in current_user.get("wishlist", [])]
    vehicle_ids = [vid for vid in vehicle_ids if vid is not None]
    vehicles = await vehicles_collection.find({"_id": {"$in": vehicle_ids}}).to_list(length=None)
    return [serialize_doc(vehicle) for vehicle in vehicles]


@router.post("", status_code=status.HTTP_200_OK)
async def add_to_wishlist(payload: dict, current_user: dict = Depends(get_current_user)):
    vehicle_id = payload.get("vehicleId")
    if not vehicle_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="vehicleId is required")

    if to_object_id(vehicle_id) is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid vehicleId")

    await users_collection.update_one(
        {"_id": to_object_id(current_user["id"])},
        {"$addToSet": {"wishlist": vehicle_id}},  # addToSet avoids duplicate entries
    )
    return {"success": True, "vehicleId": vehicle_id}


@router.delete("/{vehicle_id}", status_code=status.HTTP_200_OK)
async def remove_from_wishlist(vehicle_id: str, current_user: dict = Depends(get_current_user)):
    await users_collection.update_one(
        {"_id": to_object_id(current_user["id"])},
        {"$pull": {"wishlist": vehicle_id}},
    )
    return {"success": True, "vehicleId": vehicle_id}