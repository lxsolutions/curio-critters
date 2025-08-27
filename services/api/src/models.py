


from sqlalchemy import Column, String, DateTime, Integer, Float, Boolean, JSON
from sqlalchemy.sql import func
from .database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class ParentUser(Base):
    __tablename__ = "parent_users"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)
    subscription_status = Column(String, default="free")  # free, active, canceled

class ChildProfile(Base):
    __tablename__ = "child_profiles"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    parent_id = Column(String, nullable=False, index=True)
    anonymous_id = Column(String, unique=True, index=True, default=generate_uuid)  # Privacy: no child names
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_sync = Column(DateTime(timezone=True))
    local_nickname_hash = Column(String)  # Hashed nickname for local reference only

class ProgressSummary(Base):
    __tablename__ = "progress_summaries"
    
    child_anonymous_id = Column(String, primary_key=True, index=True)
    total_sessions = Column(Integer, default=0)
    total_minutes = Column(Integer, default=0)
    total_questions = Column(Integer, default=0)
    total_correct = Column(Integer, default=0)
    overall_accuracy = Column(Float, default=0.0)
    fact_mastery = Column(JSON, default=dict)  # {fact_family: mastery_score}
    last_updated = Column(DateTime(timezone=True), server_default=func.now())

class LearningSession(Base):
    __tablename__ = "learning_sessions"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    child_anonymous_id = Column(String, index=True, nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    duration = Column(Integer, nullable=False)  # seconds
    total_questions = Column(Integer, nullable=False)
    correct_answers = Column(Integer, nullable=False)
    accuracy = Column(Float, nullable=False)
    results = Column(JSON, nullable=False)  # List of session results
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    parent_id = Column(String, unique=True, index=True, nullable=False)
    stripe_customer_id = Column(String, unique=True)
    stripe_subscription_id = Column(String, unique=True)
    status = Column(String, default="inactive")  # active, canceled, past_due
    current_period_end = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


