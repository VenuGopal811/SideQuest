from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from sqlalchemy.orm import Session
import uuid

from app.config import settings
from app.models.models import User


# ─── JWT ──────────────────────────────────────────────────────────────────────

def create_access_token(user_id: str) -> str:
    """Create a signed JWT for a given user ID."""
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    payload = {"sub": user_id, "exp": expire}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str) -> str | None:
    """Decode JWT and return user_id (sub), or None if invalid/expired."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None


# ─── User helpers ─────────────────────────────────────────────────────────────

def create_anonymous_user(db: Session) -> User:
    """Create a new user with a random UUID. No credentials needed."""
    user = User(id=str(uuid.uuid4()), xp=0, level=0, active_quest_id=None)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_by_id(db: Session, user_id: str) -> User | None:
    return db.query(User).filter(User.id == user_id).first()
