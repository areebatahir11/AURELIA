from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings

client = AsyncIOMotorClient(settings.mongodb_uri)
db = client[settings.mongodb_db_name]

users_collection = db["users"]
brands_collection = db["brands"]
vehicles_collection = db["vehicles"]
orders_collection = db["orders"]


async def ping_database():
    """Called on startup to fail fast if Atlas connection is misconfigured."""
    await client.admin.command("ping")