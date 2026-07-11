import os
import json
from dotenv import load_dotenv
from groq import Groq
from typing import TypedDict
from langgraph.graph import StateGraph, START, END

# Load environment variables
load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# 1. Define the Graph State (The memory of the agent)
class AgentState(TypedDict):
    messages: str
    extracted_data: str

# 2. Define the extraction node
def extract_data_node(state: AgentState):
    prompt = f"""
    You are a strict data extraction bot for a Pharma CRM. Extract the following from the user input into a raw JSON object.
    
    Keys required: 
    - hcpName (string)
    - designation (string)
    - date (string, YYYY-MM-DD format if available, otherwise empty)
    - time (string, HH:MM format if available, otherwise empty)
    - attendees (string)
    - topicsDiscussed (string)
    - sentiment (string, must be 'Positive', 'Neutral', or 'Negative')
    - outcomes (string)
    - followUpActions (string)
    - aiSuggestions (array of strings)
    - confidenceScore (integer 0-100)

    If a field is missing, leave the value as an empty string (or empty array for aiSuggestions).
    Output ONLY the raw JSON object. Do not include markdown formatting or code blocks.
    
    User input: {state['messages']}
    """
    
    # CRITICAL: Using the assignment-mandated gemma2-9b-it model
    response = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="gemma2-9b-it", 
        temperature=0.1,
    )
    
    return {"extracted_data": response.choices[0].message.content}

# 3. Build and Compile the LangGraph
builder = StateGraph(AgentState)
builder.add_node("extract", extract_data_node)
builder.add_edge(START, "extract")
builder.add_edge("extract", END)
graph = builder.compile()

# 4. The main function called by your API endpoint
def process_chat_message(latest_message: str):
    # Invoke the LangGraph with the initial state
    result = graph.invoke({"messages": latest_message, "extracted_data": ""})
    raw_response = result["extracted_data"]
    
    # Clean the JSON string (strip markdown if the model accidentally included it)
    clean_json = raw_response.replace("```json", "").replace("```", "").strip()
    
    try:
        parsed_data = json.loads(clean_json)
        return parsed_data
    except json.JSONDecodeError:
        print("Failed to parse JSON:", clean_json)
        return None