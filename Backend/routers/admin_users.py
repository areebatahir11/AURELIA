# routers/admin_users.py
from fastapi import APIRouter, Depends, HTTPException, status

from core.database import users_collection
from core.deps import require_admin
from core.security import hash_password
from models.user import UserOut, UserSignup
from utils.serializers import serialize_doc

router = APIRouter(prefix="/admin/users", tags=["Admin Users"])


@router.post("/", response_model=UserOut)
async def create_admin_user(
    payload: UserSignup,
    current_admin: dict = Depends(require_admin),
):
    existing = await users_collection.find_one({"email": payload.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    user_doc = {
        "name": payload.name,
        "email": payload.email,
        "hashed_password": hash_password(payload.password),
        "role": "admin",
        "wishlist": [],
        "is_active": True,
    }

    result = await users_collection.insert_one(user_doc)
    user_id = str(result.inserted_id)

    user_out = serialize_doc(user_doc)
    user_out["id"] = user_id
    user_out.pop("hashed_password", None)
    user_out.pop("hashedPassword", None)

    return UserOut(**user_out)