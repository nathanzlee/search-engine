from fastapi import FastAPI
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from .se_whoosh import searchQuery 
from .xml import parseFile
import requests
import json 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/search")
async def receive_data(request: Request):
    req_body = await request.json()
    results = searchQuery(req_body['query'])
    return results

@app.post("/api/case")
async def getCase(request: Request):
    req_body = await request.json()
    casefile = req_body['case']
    with open('./legal_data_10k/' + casefile) as f:
        s = f.read()
        return s

@app.post("/api/file")
async def searchFile(request: Request):
    req_body = await request.json() 
    print(req_body)
    case = parseFile(req_body['file'])
    print(case)
    # results = searchQuery(case)
    results = []
    courtResults = searchQuery(case['caseCourt'])
    reasonResults = searchQuery(case['caseReason'])
    print(courtResults['total'])
    print(reasonResults['total'])
    for r in courtResults['relevantDocs']:
        results.append(r)
    for r in reasonResults['relevantDocs']:
        if r['id'] not in [result['id'] for result in results]:
            results.append(r)
    print(len(results))
    return {
        'total': courtResults['total'] + reasonResults['total'],
        'relevantDocs': results
    }

@app.post("/api/autofill")
async def autofill(request: Request):
    req_body = await request.json()
    print(req_body['query'])
    keyword = req_body['query']
    headers = {
        "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19582"
    }
    # client param could be replaced with firefox or other browser
    link = 'http://google.com/complete/search?client=chrome&q='
    suggestions = []
    with requests.Session() as session:
        session.headers.update(headers)
        response = session.get(link+keyword)
        response.encoding = 'utf-8'  # Set the correct encoding
        for result in json.loads(response.text)[1]:
            print("yo~:", result)
            suggestions.append(result)
    # response = requests.get(link+keyword, headers=headers)
    # response.encoding = 'utf-8'  # Set the correct encoding
    # suggestions = []
    # for result in json.loads(response.text)[1]:
    #     print("yo~:", result)
    #     suggestions.append(result)
    return suggestions

    










