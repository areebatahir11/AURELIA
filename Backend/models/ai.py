from pydantic import BaseModel


class ConciergeRequest(BaseModel):
    message: str
    conversationId: str | None = None


class ConciergeResponse(BaseModel):
    reply: str
    conversationId: str
    referencedVehicleIds: list[str] = []