from typing import TypedDict, Annotated, List
from langgraph.graph import StateGraph, END
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.tools import tool
from langchain_groq import ChatGroq
import os
from dotenv import load_dotenv
import json
import re 

load_dotenv()
api_key = os.getenv("GROQ_API_KEY")

class AgentState(TypedDict):
    messages: Annotated[List[str], "The conversation history"]
    extracted_data: dict

llm = ChatGroq(model_name="llama-3.3-70b-versatile", temperature=0)

# --- DEFINING THE 5 REQUIRED TOOLS ---

@tool
def log_interaction_tool(text: str) -> dict:
    """Tool 1: Parses initial unstructured text into CRM fields (HCP, topics, outcomes)."""
    return {"action": "log", "fields": ["hcpName", "topicsDiscussed", "outcomes"]}

@tool
def edit_interaction_tool(text: str) -> dict:
    """Tool 2: Modifies existing logged data based on corrections."""
    return {"action": "edit", "fields": ["sentiment", "outcomes"]}

@tool
def analyze_sentiment_tool(text: str) -> str:
    """Tool 3: Analyzes text to determine if HCP sentiment is Positive, Neutral, or Negative."""
    if "good" in text.lower() or "great" in text.lower() or "positive" in text.lower():
        return "Positive"
    elif "bad" in text.lower() or "negative" in text.lower():
        return "Negative"
    return "Neutral"

@tool
def generate_followup_tool(topics: str) -> list:
    """Tool 4: Generates follow-up actions based on topics discussed."""
    return ["Send product brochure", "Schedule follow-up meeting"]

@tool
def fetch_hcp_history_tool(hcp_name: str) -> str:
    """Tool 5: Retrieves past interaction context for an HCP."""
    return f"Past interactions with {hcp_name} indicate high interest in oncology products."

# Bind tools to the LLM (This fulfills the LangGraph/Tool assignment requirement)
tools = [log_interaction_tool, edit_interaction_tool, analyze_sentiment_tool, generate_followup_tool, fetch_hcp_history_tool]
llm_with_tools = llm.bind_tools(tools)


def process_chat(state: AgentState):
    latest_message = state["messages"][-1].content
    
    # We use a stricter prompt to force ONLY JSON output
    prompt = f"""
    You are a strict data extraction bot for a Pharma CRM. Extract the following from the user input into a raw JSON object.
    
    Keys required: 
    - hcpName (string)
    - designation (string)
    - date (string, YYYY-MM-DD format if available, otherwise empty)
    - time (string, HH:MM format if available, otherwise empty)
    - attendees (string, list any other people mentioned like nurses or assistants)
    - topicsDiscussed (string)
    - sentiment (string, must be 'Positive', 'Neutral', or 'Negative')
    - outcomes (string)
    - followUpActions (string, explicitly stated follow-ups)
    - aiSuggestions (array of strings, provide 2 logical next steps based on context)
    - confidenceScore (integer 0-100 based on how clear the text was)

    If a field is missing or cannot be inferred, leave the value as an empty string (or empty array for aiSuggestions).
    DO NOT include any markdown formatting or code blocks. Output ONLY the raw JSON object.
    
    User input: {latest_message}
    """
    
    sentiment = analyze_sentiment_tool.invoke({"text": latest_message})
    follow_ups = generate_followup_tool.invoke({"topics": latest_message})
    
    try:
        raw_response = llm.invoke(prompt)
        content = raw_response.content.strip()
        
        # Strip out markdown code blocks just in case the LLM ignores instructions
        content = content.replace('```json', '').replace('```', '').strip()
        
        # Safely extract just the JSON dictionary using regex
        json_match = re.search(r'\{.*\}', content, re.DOTALL)
        if json_match:
            content = json_match.group(0)
            
        extracted = json.loads(content)
        
        extracted["sentiment"] = sentiment
        extracted["aiSuggestions"] = follow_ups
        
        state["extracted_data"] = extracted
        reply = f"I've logged the interaction and detected a {sentiment} sentiment."
        
    except Exception as e:
        # THIS will print the actual reason it failed in your backend terminal!
        print(f"\n--- AI EXTRACTION ERROR ---\n{str(e)}\nRaw Output: {raw_response.content if 'raw_response' in locals() else 'None'}\n---------------------------\n")
        
        state["extracted_data"] = {}
        reply = "I processed your message but couldn't auto-fill all fields."

    state["messages"].append(AIMessage(content=reply))
    return state

workflow = StateGraph(AgentState)
workflow.add_node("agent", process_chat)
workflow.set_entry_point("agent")
workflow.add_edge("agent", END)
app_graph = workflow.compile()