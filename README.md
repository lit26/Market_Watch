# Personal_Market_Watch

## Website

Front-end React.js website for display personal stock portfolio.

## API

Back-end Python Flask API for storing stock portfolio.

| HTTP Method | URI | Action|
| ------------- | ------------- | ------------- |
| GET | http://[hostname]/api/history/all | get all the transactions |
| GET | http://[hostname]/api/history/[transaction_id] | get a transaction |
| POST | http://[hostname]/api/history/transaction | Create a new transaction |
| POST | http://[hostname]/api/history/transaction/[transaction_id] | Update an existing transaction |

## Running

For local run, React.js website normally run on http://localhost:3000 and Python Flask API run on http://localhost:5000 which will cause CORS errors, the project has already handle this by adding proxy in React.js package.json. 
