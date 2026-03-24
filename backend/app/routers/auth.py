from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.auth_service import create_anonymous_user, create_access_token
from app.schemas.schemas import TokenOut, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/anonymous", response_model=TokenOut, status_code=201)
def sign_in_anonymous(db: Session = Depends(get_db)):
    """
    Create a new anonymous user and return a JWT.
    Call this once on first app launch and store the token locally.
    """
    user = create_anonymous_user(db)
    token = create_access_token(user.id)
    return TokenOut(access_token=token, user=UserOut.model_validate(user))
