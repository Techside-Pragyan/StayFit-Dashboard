from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String)

    logs = relationship("HealthLog", back_populates="owner")
    goals = relationship("Goal", back_populates="owner", uselist=False)

class HealthLog(Base):
    __tablename__ = "health_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime, default=datetime.utcnow)
    weight = Column(Float, nullable=True) # in kg
    calories_intake = Column(Integer, nullable=True) # in kcal
    steps = Column(Integer, nullable=True) # count
    sleep_hours = Column(Float, nullable=True) # in hours
    water_intake = Column(Float, nullable=True) # in liters

    owner = relationship("User", back_populates="logs")

class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    daily_calories = Column(Integer, default=2000)
    daily_steps = Column(Integer, default=10000)
    daily_water = Column(Float, default=2.5) # in liters
    target_weight = Column(Float, nullable=True)

    owner = relationship("User", back_populates="goals")
