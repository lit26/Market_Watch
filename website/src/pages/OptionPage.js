import React,{useState, useEffect} from 'react'
import './Stockpage.css';
import {Accordion, Container} from 'react-bootstrap';
import axios from 'axios';

import CurrentOptionCard from '../components/CurrentOptionCard'
import HistoryStockCard from '../components/HistoryStockCard'
import { calculateCurrent, calculateHistoryCost } from '../components/util'
import AddOption from '../components/AddOption';

function OptionPage() {
    const [currentOptions, setCurrentOptions] = useState([]);
    const [historyOptions, setHistoryOptions] = useState([]);
    const [currentOptionsCards, setCurrentOptionsCards] = useState([]);
    const [historyOptionsCards, setHistoryOptionsCards] = useState([]);
    const [currentTotalReturn, setCurrentTotalReturn] = useState(0);
    const [historyTotalReturn, setHistoryTotalReturn] = useState(0);

    useEffect(() => {
		axios.get('/api/option/all')
			.then(res => {
                let data = res.data;
                setCurrentOptions(data.filter(trans => trans.status==='Open'))
                setHistoryOptions(data.filter(trans => trans.status==='Close'))
			})
			.catch(err => {
				console.log(err)
            })
    },[])

    useEffect(() => {
        let optionCards = [];
        let currentTotalReturn = 0;
        for (let i = 0; i < currentOptions.length; i++) {
            let currentOption = currentOptions[i];
            let current = calculateCurrent(currentOption.transaction);

            let totalReturn = (currentOption.current*current[1] - current[0])*100;
            currentTotalReturn = currentTotalReturn + totalReturn;
            optionCards.push(
                <CurrentOptionCard 
                    key={i}
                    currentOption={currentOption}
                    totalCost={current[0]}
                    quantity={current[1]}
                    totalReturn={totalReturn}
                    index={i}
                />
            )
        }
        setCurrentTotalReturn(currentTotalReturn)
        setCurrentOptionsCards(optionCards);
    },[currentOptions]);

    useEffect(() => {
        let optionCards = [];
        let historyTotalReturn = 0;
        for (let i = historyOptions.length-1; i >=0; i--) {
            let historyOption = historyOptions[i];
            let history = calculateHistoryCost(historyOption.transaction);
            let totalReturn = history[0]*100;
            historyTotalReturn = historyTotalReturn + totalReturn;
            optionCards.push(
                <HistoryStockCard 
                    key={i}
                    historyStock={historyOption}
                    totalReturn={totalReturn}
                    pctReturn={history[1]}
                />
            )
        }
        setHistoryTotalReturn(historyTotalReturn)
        setHistoryOptionsCards(optionCards);
    },[historyOptions])

    return (
        <div className="stockPage">
            <div className="stockPage__detail">
                <div className="stockPage__left">
                    <div className="stockPage__header">
                        <h3>Current</h3>
                    </div>
                    <div className="stockPage__dataTable">
                        <Accordion>
                            {currentOptionsCards}
                        </Accordion>
                    </div>
                </div>
                <div className="stockPage__right">
                    <div className="stockPage__header">
                        <h3>History</h3>
                        <AddOption />
                    </div>
                    <div className="stockPage__dataTable">
                        <Container>
                            {historyOptionsCards}
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

export default OptionPage
