#core/deps.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from core.database import users_collection
from core.security import decode_access_token
from utils.serializers import serialize_doc, to_object_id

bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme)) -> dict:
    """Raises 401 if no valid token is present. Use this on any route that requires login
    (wishlist, orders, account) — matches the frontend's axios interceptor, which attaches
    the token from localStorage on every request automatically.
    """
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    payload = decode_access_token(credentials.credentials)
    if payload is None or "sub" not in payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    user_id = to_object_id(payload["sub"])
    user = await users_collection.find_one({"_id": user_id})
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User no longer exists")

    return serialize_doc(user)


async def require_admin(current_user: dict = Depends(get_current_user)) -> dict:
    """Blocks non-admins server-side — this is the enforcement point, never trust
    the frontend hiding an 'Admin' link as the actual access control.
    """
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return current_user