from sqlalchemy import Column, Integer, String, Text
from database import Base

class InteractionLog(Base):
    __tablename__ = "interaction_logs"

    id = Column(Integer, primary_key=True, index=True)
    hcp_name = Column(String(255), index=True)
    designation = Column(String(255)) # <-- NEW FIELD
    interaction_type = Column(String(50))
    date = Column(String(50))
    time = Column(String(50))
    topics_discussed = Column(Text)
    sentiment = Column(String(50))
    outcomes = Column(Text)
    follow_up_actions = Column(Text)
    date = Column(String, nullable=True)
    time = Column(String, nullable=True)
    samples_distributed = Column(String, nullable=True)
    ai_suggested_follow_ups = Column(String, nullable=True)
    voice_note_summary = Column(String, nullable=True)
    