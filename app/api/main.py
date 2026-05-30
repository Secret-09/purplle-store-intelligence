from fastapi import FastAPI

from app.api.routers import events, health, stores

app = FastAPI(title="Purplle Store Intelligence API")

app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(stores.router, prefix="/stores", tags=["stores"])
app.include_router(events.router, prefix="/events", tags=["events"])
