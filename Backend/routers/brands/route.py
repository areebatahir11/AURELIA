from fastapi import APIRouter, Depends, HTTPException, status

from core.database import brands_collection
from core.deps import require_admin
from models.brand import BrandCreate, BrandOut, BrandUpdate
from utils.serializers import serialize_doc, to_object_id

router = APIRouter(prefix="/brands", tags=["Brands"])


@router.get("", response_model=list[BrandOut])
async def get_brands():
    brands = await brands_collection.find().to_list(length=None)
    return [serialize_doc(brand) for brand in brands]


@router.get("/{slug}", response_model=BrandOut)
async def get_brand_by_slug(slug: str):
    brand = await brands_collection.find_one({"slug": slug})
    if not brand:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Brand not found")
    return serialize_doc(brand)


# --- Admin-only below this point ---


@router.post("", response_model=BrandOut, status_code=status.HTTP_201_CREATED)
async def create_brand(payload: BrandCreate, admin=Depends(require_admin)):
    existing = await brands_collection.find_one({"slug": payload.slug})
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="A brand with this slug already exists")

    result = await brands_collection.insert_one(payload.model_dump())
    created = await brands_collection.find_one({"_id": result.inserted_id})
    return serialize_doc(created)


@router.patch("/{brand_id}", response_model=BrandOut)
async def update_brand(brand_id: str, payload: BrandUpdate, admin=Depends(require_admin)):
    object_id = to_object_id(brand_id)
    if object_id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid brand id")

    updates = {key: value for key, value in payload.model_dump().items() if value is not None}
    if updates:
        await brands_collection.update_one({"_id": object_id}, {"$set": updates})

    updated = await brands_collection.find_one({"_id": object_id})
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Brand not found")
    return serialize_doc(updated)


@router.delete("/{brand_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_brand(brand_id: str, admin=Depends(require_admin)):
    object_id = to_object_id(brand_id)
    if object_id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid brand id")

    result = await brands_collection.delete_one({"_id": object_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Brand not found")