from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from core.database import ping_database
from routers import ai, auth, brands, dashboard, orders, vehicles, wishlist


@asynccontextmanager
async def lifespan(app: FastAPI):
    await ping_database()  # fails fast on startup if MONGODB_URI is wrong, instead of erroring on first request
    yield


app = FastAPI(title="AURELIA API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# All routes are mounted under /api/v1 to match NEXT_PUBLIC_API_BASE_URL in the frontend's config/api.js
API_PREFIX = "/api/v1"
app.include_router(auth.router, prefix=API_PREFIX)
app.include_router(brands.router, prefix=API_PREFIX)
app.include_router(vehicles.router, prefix=API_PREFIX)
app.include_router(wishlist.router, prefix=API_PREFIX)
app.include_router(orders.router, prefix=API_PREFIX)
app.include_router(ai.router, prefix=API_PREFIX)
app.include_router(dashboard.router, prefix=API_PREFIX)


@app.get("/")
async def root():
    return {"status": "AURELIA API is running", "docs": "/docs"}