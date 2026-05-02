from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: str
    name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)

class HealthLogBase(BaseModel):
    weight: Optional[float] = None
    calories_intake: Optional[int] = None
    steps: Optional[int] = None
    sleep_hours: Optional[float] = None
    water_intake: Optional[float] = None

class HealthLogCreate(HealthLogBase):
    pass

class HealthLog(HealthLogBase):
    id: int
    user_id: int
    date: datetime
    
    model_config = ConfigDict(from_attributes=True)

class GoalBase(BaseModel):
    daily_calories: Optional[int] = 2000
    daily_steps: Optional[int] = 10000
    daily_water: Optional[float] = 2.5
    target_weight: Optional[float] = None

class GoalCreate(GoalBase):
    pass

class Goal(GoalBase):
    id: int
    user_id: int
    
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
