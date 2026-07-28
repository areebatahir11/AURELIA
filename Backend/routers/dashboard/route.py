from fastapi import APIRouter, Depends

from core.database import orders_collection, vehicles_collection
from core.deps import require_admin

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats")
async def get_stats(admin=Depends(require_admin)):
    total_vehicles = await vehicles_collection.count_documents({})
    active_listings = await vehicles_collection.count_documents({"status": "available"})
    total_orders = await orders_collection.count_documents({})

    revenue_pipeline = [
        {"$match": {"status": "Completed"}},
        {
            "$lookup": {
                "from": "vehicles",
                "let": {"vehicle_id_str": "$vehicleId"},
                "pipeline": [{"$match": {"$expr": {"$eq": [{"$toString": "$_id"}, "$$vehicle_id_str"]}}}],
                "as": "vehicle",
            }
        },
        {"$unwind": "$vehicle"},
        {"$group": {"_id": None, "total": {"$sum": "$vehicle.price"}}},
    ]
    revenue_result = await orders_collection.aggregate(revenue_pipeline).to_list(length=1)
    total_revenue = revenue_result[0]["total"] if revenue_result else 0

    return {
        "totalVehicles": total_vehicles,
        "activeListings": active_listings,
        "totalOrders": total_orders,
        "totalRevenue": total_revenue,
    }