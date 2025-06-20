from http.client import HTTPException
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import csv

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend's URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os

cwd = os.getcwd()  # Get the current working directory (cwd)
files = os.listdir(cwd)  # Get all the files in that director

print("Current working directory:", cwd)
print("Files in the current directory:", files)

def read_csv(filename):
    with open(filename, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        return list(reader)

@app.get("/data")
def get_data():
    data = read_csv('backend/data.csv')
    return JSONResponse(content=data)

@app.get("/data/{item_id}")
def get_data_by_id(item_id: str):
    data = read_csv('data.csv')
    for row in data:
        if row.get('ID') == item_id:
            return JSONResponse(content=row)
    raise HTTPException(status_code=404, detail="Item not found")

import uvicorn

if __name__ == "__main__":
    uvicorn.run("backend:app", host="0.0.0.0", port=9000, reload=True)