from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, SessionLocal
from app.models.models import Base
from app.routers import auth, users, quests
from app.services.quest_service import seed_quests

# ─── Create tables ────────────────────────────────────────────────────────────
Base.metadata.create_all(bind=engine)

# ─── Seed quest pool ──────────────────────────────────────────────────────────
with SessionLocal() as db:
    seed_quests(db)

# ─── App ──────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="SideQuest API",
    description="Gamify your life — one random quest at a time.",
    version="0.1.0",
)

# Allow requests from Expo dev server and your production domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tighten this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ──────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(quests.router)


@app.get("/health")
def health():
    return {"status": "ok"}
