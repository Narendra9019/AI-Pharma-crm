# AI Pharma CRM

I built this full-stack application to solve a common bottleneck in healthcare sales: manual data entry. Instead of forcing reps to fill out endless form fields after meeting with a doctor, I integrated an LLM so they can just drop in an unstructured "voice note" style summary. The AI handles the rest by extracting the relevant data, analyzing the sentiment, and saving it directly to a database.

## Features

* **Zero-Click Data Entry:** You type or paste an unstructured note (e.g., "Met Dr. Smith at 2pm, she loved the new asthma drug but wants samples."). The AI parses the date, time, attendees, outcomes, and sentiment, auto-filling the frontend form instantly.
* **Custom Analytics Dashboard:** I wanted a clean way to visualize the data, so I built a responsive dashboard from scratch without relying on heavy charting libraries. It tracks interaction metrics and AI sentiment trends system-wide.
* **Full-Stack Sync:** A React/Redux frontend that communicates seamlessly with a Python/FastAPI backend. It includes dynamic UI elements like conditional confidence badges based on the AI's output.
* **Reliable Database:** Built with SQLite and SQLAlchemy. I designed the database schemas to gracefully handle missing data and complex nested arrays, ensuring the API doesn't crash if the AI misses a minor detail in the text.

## Tech Stack

* **Frontend:** React.js, Redux, plain CSS (with dynamic Dark Mode support), Vite
* **Backend:** Python, FastAPI, SQLAlchemy, SQLite
* **AI Integration:** Groq API for fast LLM inference

## Running the project locally

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/Narendra9019/AI-Pharma-crm.git
cd AI-Pharma-crm
\`\`\`

### 2. Start the backend
\`\`\`bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate # For Windows use: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy pydantic python-dotenv groq

# Set up environment variables
# Create a .env file in the backend folder and add your key:
# GROQ_API_KEY=your_actual_api_key_here

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