from datetime import datetime
from typing import Literal
from pydantic import BaseModel, Field


ORDER_STATUSES = ["Pending", "Confirmed", "In Process", "Completed", "Cancelled"]


class OrderCreate(BaseModel):
    vehicleId: str
    contactName: str
    contactEmail: str
    contactPhone: str
    notes: str = ""


class OrderStatusUpdate(BaseModel):
    status: Literal["Pending", "Confirmed", "In Process", "Completed", "Cancelled"]


class OrderOut(BaseModel):
    id: str
    userId: str
    vehicleId: str
    contactName: str
    contactEmail: str
    contactPhone: str
    notes: str = ""
    status: str = "Pending"
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    expiresAt: datetime | None = None