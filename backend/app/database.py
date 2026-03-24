from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.config import settings

# ─── Engine ───────────────────────────────────────────────────────────────────
if settings.DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        settings.DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(settings.DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# ─── Base model class ─────────────────────────────────────────────────────────
class Base(DeclarativeBase):
    pass


# ─── Dependency: yields a DB session per request ──────────────────────────────
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
