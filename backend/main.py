from fastapi import FastAPI, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from agent import app_graph
from fastapi.middleware.cors import CORSMiddleware
from langchain_core.messages import HumanMessage
import models
from database import engine, get_db
from typing import Optional

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class SaveInteractionRequest(BaseModel):
    hcpName: str
    designation: str # <-- NEW FIELD
    topicsDiscussed: str
    sentiment: str
    outcomes: str
    date: Optional[str] = None
    time: Optional[str] = None
    samplesDistributed: Optional[str] = None
    aiSuggestedFollowUps: Optional[str] = None
    voiceNoteSummary: Optional[str] = None

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    initial_state = {
        "messages": [HumanMessage(content=request.message)],
        "extracted_data": {}
    }
    final_state = app_graph.invoke(initial_state)
    return {
        "reply": final_state["messages"][-1].content,
        "form_data": final_state["extracted_data"]
    }

@app.post("/api/save")
async def save_interaction(req: SaveInteractionRequest, db: Session = Depends(get_db)):
    db_log = models.InteractionLog(
        hcp_name=req.hcpName,
        designation=req.designation, # <-- NEW FIELD
        topics_discussed=req.topicsDiscussed,
        sentiment=req.sentiment,
        outcomes=req.outcomes
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return {"status": "success", "id": db_log.id}

# <-- NEW ENDPOINT TO VIEW DATABASE -->
@app.get("/api/logs")
async def get_logs(db: Session = Depends(get_db)):
    logs = db.query(models.InteractionLog).order_by(models.InteractionLog.id.desc()).all()
    
    # Returning a structured response instead of a raw array
    return {
        "status": "success",
        "total_records": len(logs),
        "data": logs
    }

@app.get("/")
async def root():
    return {
        "status": "Online", 
        "message": "AI-First CRM Backend is running perfectly!",
        "endpoints": ["/api/chat", "/api/save", "/api/logs"]
    }

# <-- NEW ENDPOINT TO DELETE LOGS -->
@app.delete("/api/logs/{log_id}")
async def delete_log(log_id: int, db: Session = Depends(get_db)):
    # Find the specific log by ID
    log_to_delete = db.query(models.InteractionLog).filter(models.InteractionLog.id == log_id).first()
    
    if log_to_delete:
        db.delete(log_to_delete)
        db.commit()
        return {"status": "success", "message": f"Log {log_id} deleted."}
    
    return {"status": "error", "message": "Log not found."}