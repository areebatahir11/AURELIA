# from fastapi import APIRouter, Depends, HTTPException, status

# from core.database import users_collection
# from core.deps import get_current_user
# from core.security import create_access_token, hash_password, verify_password
# from models.user import TokenResponse, UserLogin, UserOut, UserSignup
# from utils.serializers import serialize_doc

# router = APIRouter(prefix="/auth", tags=["Auth"])


# @router.post("/signup", response_model=TokenResponse)
# async def signup(payload: UserSignup):
#     existing = await users_collection.find_one({"email": payload.email})
#     if existing:
#         raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

#     user_doc = {
#         "name": payload.name,
#         "email": payload.email,
#         "hashedPassword": hash_password(payload.password),
#         "role": "customer",
#         "wishlist": [],
#     }
#     result = await users_collection.insert_one(user_doc)
#     user_doc["_id"] = result.inserted_id

#     token = create_access_token({"sub": str(result.inserted_id)})
#     user_out = serialize_doc(user_doc)
#     user_out.pop("hashedPassword", None)
#     return TokenResponse(token=token, user=UserOut(**user_out))


# @router.post("/login", response_model=TokenResponse)
# async def login(payload: UserLogin):
#     user = await users_collection.find_one({"email": payload.email})
#     if not user or not verify_password(payload.password, user.get("hashedPassword", "")):
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

#     token = create_access_token({"sub": str(user["_id"])})
#     user_out = serialize_doc(user)
#     user_out.pop("hashedPassword", None)
#     return TokenResponse(token=token, user=UserOut(**user_out))


# @router.get("/me", response_model=UserOut)
# async def get_me(current_user: dict = Depends(get_current_user)):
#     current_user.pop("hashedPassword", None)
#     return UserOut(**current_user)


# routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status

from core.database import users_collection
from core.deps import get_current_user
from core.security import create_access_token, hash_password, verify_password
from models.user import TokenResponse, UserLogin, UserOut, UserSignup
from utils.serializers import serialize_doc

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup", response_model=TokenResponse)
async def signup(payload: UserSignup):
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
        "role": "customer",
        "wishlist": [],
        "is_active": True,
    }

    result = await users_collection.insert_one(user_doc)
    user_id = str(result.inserted_id)

    token = create_access_token({"sub": user_id, "role": "customer"})

    user_out = serialize_doc(user_doc)
    user_out["id"] = user_id
    user_out.pop("hashed_password", None)
    user_out.pop("hashedPassword", None)

    return TokenResponse(token=token, user=UserOut(**user_out))


@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin):
    user = await users_collection.find_one({"email": payload.email})
    if not user or not verify_password(
        payload.password,
        user.get("hashed_password", "") or user.get("hashedPassword", ""),
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is deactivated",
        )

    user_id = str(user["_id"])
    role = user.get("role", "customer")

    token = create_access_token({"sub": user_id, "role": role})

    user_out = serialize_doc(user)
    user_out["id"] = user_id
    user_out.pop("hashed_password", None)
    user_out.pop("hashedPassword", None)

    return TokenResponse(token=token, user=UserOut(**user_out))


@router.get("/me", response_model=UserOut)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserOut(**current_user)