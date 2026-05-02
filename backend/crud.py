from sqlalchemy.orm import Session
import models, schemas, auth

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(email=user.email, name=user.name, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create default goals
    db_goal = models.Goal(user_id=db_user.id)
    db.add(db_goal)
    db.commit()
    
    return db_user

def create_health_log(db: Session, log: schemas.HealthLogCreate, user_id: int):
    db_log = models.HealthLog(**log.model_dump(), user_id=user_id)
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def get_health_logs(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.HealthLog).filter(models.HealthLog.user_id == user_id).order_by(models.HealthLog.date.desc()).offset(skip).limit(limit).all()

def get_user_goal(db: Session, user_id: int):
    return db.query(models.Goal).filter(models.Goal.user_id == user_id).first()

def update_user_goal(db: Session, user_id: int, goal: schemas.GoalCreate):
    db_goal = db.query(models.Goal).filter(models.Goal.user_id == user_id).first()
    if db_goal:
        for key, value in goal.model_dump().items():
            setattr(db_goal, key, value)
        db.commit()
        db.refresh(db_goal)
        return db_goal
    return None
