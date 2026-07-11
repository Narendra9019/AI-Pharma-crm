# AI Pharma CRM

I built this full-stack application to solve a common bottleneck in healthcare sales: manual data entry. Instead of forcing reps to fill out endless form fields after meeting with a doctor, I integrated an LLM so they can just drop in an unstructured "voice note" style summary. The AI handles the rest by extracting the relevant data using LangGraph, analyzing the sentiment, and saving it directly to a production PostgreSQL database.

## Features

* **Zero-Click Data Entry:** You type or paste an unstructured note. The AI parses the date, time, attendees, outcomes, and sentiment, auto-filling the frontend form instantly.
* **Intelligent Agent Orchestration:** I integrated LangGraph to manage the AI agent workflow, ensuring reliable data extraction and state management.
* **Custom Analytics Dashboard:** A responsive dashboard built from scratch to track interaction metrics and AI sentiment trends.
* **Production-Grade Backend:** The application is backed by PostgreSQL (hosted on Supabase) with SQLAlchemy ORM, ensuring scalability and security for sensitive healthcare data.

## Tech Stack

* **Frontend:** React.js, Redux, CSS, Vite
* **Backend:** Python, FastAPI, SQLAlchemy, PostgreSQL (Supabase)
* **AI Integration:** Groq API (using llama-3.1-8b-instant), LangGraph

## Running the project locally

### 1. Clone the repository
```bash
git clone [https://github.com/Narendra9019/AI-Pharma-crm.git](https://github.com/Narendra9019/AI-Pharma-crm.git)
cd AI-Pharma-crm

### 2. Start the backend
\`\`\`bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate # For Windows use: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy pydantic python-dotenv groq langgraph psycopg2-binary

# Set up environment variables
# Create a .env file in the backend folder and add your keys:
# GROQ_API_KEY=your_actual_groq_api_key_here
# DIRECT_URL=your_supabase_postgresql_connection_string_here

# Run the server
python -m uvicorn main:app --reload
\`\`\`
### 3. Start the frontend
Open a new terminal window:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

## Roadmap
For the next phase of this project, I am exploring ways to implement AES encryption to secure the patient and doctor data at rest, alongside researching blockchain-backed synchronization for immutable audit logs.