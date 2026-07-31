from fastapi import APIRouter

from core.database import orders_collection, vehicles_collection

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

# NOTE: intentionally public, not admin-only — the homepage's marketing "Stats" section
# (features/home/Stats.js) reads from this same endpoint. Only aggregate counts/totals are
# exposed here, never individual order or customer records, so this is a reasonable trade-off.
# If you want the admin dashboard to show something more sensitive later, add a separate
# admin-only route rather than locking this one back down.


@router.get("/stats")
async def get_stats():
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