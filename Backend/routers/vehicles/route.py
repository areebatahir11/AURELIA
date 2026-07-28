from pydantic import BaseModel

from fastapi import APIRouter, Depends, HTTPException, Query, status

from core.database import vehicles_collection
from core.deps import require_admin
from models.vehicle import VehicleCreate, VehicleOut, VehicleUpdate
from utils.serializers import serialize_doc, to_object_id

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])


class CompareRequest(BaseModel):
    vehicleIds: list[str]

# NOTE: order matters here. FastAPI matches routes top-to-bottom, so the fixed-path
# routes (/featured, /search, /compare) must be declared BEFORE the dynamic
# /{slug} route below — otherwise "featured" etc. would be swallowed as a slug value.


@router.get("", response_model=list[VehicleOut])
async def get_vehicles(
    brand: str | None = Query(default=None, description="Filter by brandSlug"),
    category: str | None = Query(default=None),
    min_price: float | None = Query(default=None),
    max_price: float | None = Query(default=None),
    sort: str | None = Query(default=None, description="newest | price_asc | price_desc | popular"),
):
    query: dict = {}
    if brand:
        query["brandSlug"] = brand
    if category:
        query["category"] = category
    if min_price is not None or max_price is not None:
        query["price"] = {}
        if min_price is not None:
            query["price"]["$gte"] = min_price
        if max_price is not None:
            query["price"]["$lte"] = max_price

    cursor = vehicles_collection.find(query)

    sort_map = {
        "newest": [("year", -1)],
        "price_asc": [("price", 1)],
        "price_desc": [("price", -1)],
    }
    if sort in sort_map:
        cursor = cursor.sort(sort_map[sort])

    vehicles = await cursor.to_list(length=None)
    return [serialize_doc(vehicle) for vehicle in vehicles]


@router.get("/featured", response_model=list[VehicleOut])
async def get_featured_vehicles():
    vehicles = await vehicles_collection.find({"featured": True}).to_list(length=None)
    return [serialize_doc(vehicle) for vehicle in vehicles]


@router.get("/search", response_model=list[VehicleOut])
async def search_vehicles(q: str = Query(min_length=1)):
    regex_query = {"$regex": q, "$options": "i"}
    vehicles = await vehicles_collection.find(
        {"$or": [{"name": regex_query}, {"brand": regex_query}, {"description": regex_query}]}
    ).to_list(length=None)
    return [serialize_doc(vehicle) for vehicle in vehicles]


@router.post("/compare", response_model=list[VehicleOut])
async def compare_vehicles(payload: CompareRequest):
    if len(payload.vehicleIds) > 4:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You can compare up to 4 vehicles at once")

    object_ids = [to_object_id(vid) for vid in payload.vehicleIds]
    object_ids = [oid for oid in object_ids if oid is not None]
    vehicles = await vehicles_collection.find({"_id": {"$in": object_ids}}).to_list(length=None)
    return [serialize_doc(vehicle) for vehicle in vehicles]


@router.get("/{slug}", response_model=VehicleOut)
async def get_vehicle_by_slug(slug: str):
    vehicle = await vehicles_collection.find_one({"slug": slug})
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    return serialize_doc(vehicle)


# --- Admin-only below this point ---


@router.post("", response_model=VehicleOut, status_code=status.HTTP_201_CREATED)
async def create_vehicle(payload: VehicleCreate, admin=Depends(require_admin)):
    existing = await vehicles_collection.find_one({"slug": payload.slug})
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="A vehicle with this slug already exists")

    result = await vehicles_collection.insert_one(payload.model_dump())
    created = await vehicles_collection.find_one({"_id": result.inserted_id})
    return serialize_doc(created)


@router.patch("/{vehicle_id}", response_model=VehicleOut)
async def update_vehicle(vehicle_id: str, payload: VehicleUpdate, admin=Depends(require_admin)):
    object_id = to_object_id(vehicle_id)
    if object_id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid vehicle id")

    updates = {key: value for key, value in payload.model_dump().items() if value is not None}
    if updates:
        await vehicles_collection.update_one({"_id": object_id}, {"$set": updates})

    updated = await vehicles_collection.find_one({"_id": object_id})
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    return serialize_doc(updated)


@router.delete("/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_vehicle(vehicle_id: str, admin=Depends(require_admin)):
    object_id = to_object_id(vehicle_id)
    if object_id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid vehicle id")

    result = await vehicles_collection.delete_one({"_id": object_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")