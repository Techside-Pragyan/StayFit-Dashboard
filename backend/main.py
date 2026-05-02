from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List

import models, schemas, crud, auth, database, ml_insights

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="StayFit API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/signup", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.post("/add-data", response_model=schemas.HealthLog)
def add_health_data(log: schemas.HealthLogCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.create_health_log(db=db, log=log, user_id=current_user.id)

@app.get("/get-data", response_model=List[schemas.HealthLog])
def get_health_data(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.get_health_logs(db=db, user_id=current_user.id, skip=skip, limit=limit)

@app.post("/goal", response_model=schemas.Goal)
def update_goal(goal: schemas.GoalCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.update_user_goal(db=db, user_id=current_user.id, goal=goal)

@app.get("/goal", response_model=schemas.Goal)
def get_goal(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.get_user_goal(db=db, user_id=current_user.id)

@app.get("/predict")
def get_insights(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    logs = crud.get_health_logs(db=db, user_id=current_user.id, limit=30)
    goal = crud.get_user_goal(db=db, user_id=current_user.id)
    insights = ml_insights.generate_insights(logs, goal)
    return insights
