import React,{useState, useEffect} from 'react'
import './Stockpage.css';
import {Button,Accordion, Container} from 'react-bootstrap';
import axios from 'axios';

import CurrentStockCard from '../components/CurrentStockCard'
import HistoryStockCard from '../components/HistoryStockCard'
import { calculateCurrent, calculateHistoryCost } from '../components/util'
import BuyStock from '../components/BuyStock';

function StockPage() {
    const [currentStocks, setCurrentStock] = useState([]);
    const [historyStocks, setHistoryStock] = useState([]);
    const [currentStocksCards, setCurrentStocksCards] = useState([]);
    const [historyStocksCards, setHistoryStocksCards] = useState([]);
    const [currentTotalReturn, setCurrentTotalReturn] = useState(0);
    const [historyTotalReturn, setHistoryTotalReturn] = useState(0);

    const stockUpdate = () =>{
        axios.get('/api/history/update')
            .then((response) => {
                console.log(response)
                window.location.reload(false);
            })
            .catch((error) => {
                console.log(error)
            });
    }
    
    useEffect(() => {
		axios.get('/api/history/all')
			.then(res => {
                let data = res.data;
                setCurrentStock(data.filter(trans => trans.status==='Open'))
                setHistoryStock(data.filter(trans => trans.status==='Close'))
			})
			.catch(err => {
				console.log(err)
            })
    },[])

    useEffect(() => {
        let stockCards = [];
        let currentTotalReturn = 0;
        for (let i = 0; i < currentStocks.length; i++) {
            let currentStock = currentStocks[i];
            let current = calculateCurrent(currentStock.transaction);
            let totalReturn = currentStock.current*current[1] - current[0];
            currentTotalReturn = currentTotalReturn + totalReturn;
            stockCards.push(
                <CurrentStockCard 
                    key={i}
                    currentStock={currentStock}
                    totalCost={current[0]}
                    quantity={current[1]}
                    totalReturn={totalReturn}
                />
            )
        }
        setCurrentTotalReturn(currentTotalReturn)
        setCurrentStocksCards(stockCards);
    },[currentStocks])

    useEffect(() => {
        let stockCards = [];
        let historyTotalReturn = 0;
        for (let i = historyStocks.length-1; i >=0; i--) {
            let historyStock = historyStocks[i];
            let history = calculateHistoryCost(historyStock.transaction);
            let totalReturn = history[0];
            historyTotalReturn = historyTotalReturn + totalReturn;
            stockCards.push(
                <HistoryStockCard 
                    key={i}
                    historyStock={historyStock}
                    totalReturn={totalReturn}
                    pctReturn={history[1]}
                />
            )
        }
        setHistoryTotalReturn(historyTotalReturn)
        setHistoryStocksCards(stockCards);
    },[historyStocks])

    return (
        <div className="stockPage">
            <div className="stockPage__detail">
                <div className="stockPage__left">
                    <div className="stockPage__header">
                        <h3>Current</h3>
                        <Button 
                            className="stockPage__updateButton" 
                            variant="link"
                            onClick={stockUpdate}>
                                Update
                        </Button>
                    </div>
                    <div className="stockPage__dataTable">
                        <Accordion>
                            {currentStocksCards}
                        </Accordion>
                    </div>
                </div>
                <div className="stockPage__right">
                    <div className="stockPage__header">
                        <h3>History</h3>
                        <BuyStock />
                    </div>
                    <div className="stockPage__dataTable">
                        <Container>
                            {historyStocksCards}
                        </Container>
                            
                    </div>
                </div>
            </div>
            <div className="stockPage__summary">
                <div className="stockPage__left">
                    <p>Current: {currentTotalReturn.toFixed(2)}</p>
                </div>
                <div className="stockPage__right">
                    <p>Total: {historyTotalReturn.toFixed(2)}</p>
                </div>
            </div>
            
            
        </div>
    )
}

export default StockPage
