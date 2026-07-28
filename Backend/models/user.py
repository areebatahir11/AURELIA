from typing import Literal
from pydantic import BaseModel, EmailStr, Field


class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=8)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: Literal["customer", "admin"] = "customer"
    wishlist: list[str] = []


class TokenResponse(BaseModel):
    token: str
    user: UserOut