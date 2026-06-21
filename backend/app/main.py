from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine
from app.routers import auth, account, tips, bankroll, performance, internal


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    await engine.dispose()


app = FastAPI(
    title="ValueBot API",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(account.router, prefix="/api/account", tags=["account"])
app.include_router(tips.router, prefix="/api/tips", tags=["tips"])
app.include_router(bankroll.router, prefix="/api/bankroll", tags=["bankroll"])
app.include_router(performance.router, prefix="/api/performance", tags=["performance"])
app.include_router(internal.router, prefix="/internal", tags=["internal"])


@app.get("/api/health")
async def health():
    return {"status": "ok"}
