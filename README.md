# Phillies Baseball R&D Questionnaire
## MLB Qualifying Offer Calculator
**Author:** Christopher Martinez


This project calculates the MLB qualifying offer based on the top 125 highest salaries from a provided dataset.


- **Application Link:** https://phillies-assessment.vercel.app/
- **GitHub Repository:** https://github.com/cmartinez131/phillies-assessment


## Tech Stack

**Backend:** Python (FastAPI), pandas, httpx  
**Frontend:** React with TypeScript, Vite, Chart.js, Axios  
**Deployment:**  
- Backend: Render  
- Frontend: Vercel

## How It Works

1. **Data Fetching:** Backend fetches salary data from the provided URL on each request
2. **Data Cleaning:** Removes corrupted/malformed values, handles missing data
3. **Calculation:** Backend Sorts salaries and calculates average of top 125
4. **Visualization:** Frontend gets the data from the backend and displays results with  charts and filters


## Running Locally

### Prerequisites

- Python 3+
- Node.js 16+
- npm


# Step 1: run the backend

Navigate to backend directory (from the project root)
```
cd backend
```

Create virtual environment (inside backend directory)
```
python -m venv venv
```

Activate virtual environment
on mac/linux:
```
source venv/bin/activate
```

Install dependencies from requirements.txt
```
pip install -r requirements.txt
```

Start the backend fastapi server
```
fastapi dev main.py
```

**Backend Server starts at:** http://localhost:8000

**Auto API docs at:** http://localhost:8000/docs


# Step 2: run the frontend

### While the backend is running, 
**open a new terminal window**
Navigate to frontend directory (from the project root)
```
cd frontend
```

Install frontend dependencies
```
npm install
```

Start the frontend
```
npm run dev
```

Frontend will start at: http://localhost:5173/

## API Endpoints
- `GET /health` - Health check
- `GET /qualifying-offer` - Returns qualifying offer with statistics and top 10 players
- `GET /get-all-rows` - Returns all salary data for the current year

## Features

- Qualifying offer calculation display
- Statistics about top 125 salaries(min, max, average, median)
- Salary distribution histogram
- Filterable salary data (Top 10, 50, 125, or All)
- Sortable data (ascending/descending)

## Testing
- If testing locally, go to http://localhost:5173/ while the backend is running.
- If testing deployed app, go to https://phillies-assessment.vercel.app/
- Refresh button makes another request
- Observe that data slightly changes with each refresh as new data is fetched on each load
- Test filter buttons to view different salaries


## Resources
- FastAPI Documentation: https://fastapi.tiangolo.com/
- Pandas Documentation: https://pandas.pydata.org/docs/
- Chart.js Documentation: https://www.chartjs.org/
- react-chartjs-2: https://react-chartjs-2.js.org/