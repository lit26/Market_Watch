import React, { useState, useEffect } from 'react'
import { Accordion, Card, Container, Row, Col } from 'react-bootstrap';
import './Currentstockcard.css'
import AddStockTrade from './AddStockTrade'

function CurrentStockCard({ currentStock, totalCost, quantity,totalReturn}) {
    const [cost, setCost] = useState(0);
    const [equity, setEquity] = useState(0);
    const [pct, setPct] = useState(0);
    const [color, setColor] = useState('#fff');
    const [trans, setTrans] = useState([]);

    useEffect(() => {
        let currentPrice = currentStock.current;
        let avgCost = totalCost / quantity;
        setCost(avgCost);
        setEquity(currentPrice * quantity);
        setPct((currentPrice - avgCost) * 100 / avgCost);
        if (currentPrice > avgCost) {
            setColor('green')
        } else if (currentPrice < avgCost) {
            setColor('red')
        }
        let stockTrans = [];
        for (let i=0;i<currentStock.transaction.length;i++){
            let tran = currentStock.transaction[i];
            let total = tran.price * tran.quantity
            if (tran.type === 'Buy') {
                total = -total;
            }
            stockTrans.push(
                <Row key={i}>
                    <Col>{tran.date}</Col>
                    <Col>${tran.price.toFixed(2)}</Col>
                    <Col>{tran.quantity}</Col>
                    <Col>${total.toFixed(2)}</Col>
                </Row>
            )
        }
        setTrans(stockTrans)
    }, [currentStock, quantity, totalCost])

    return (
        <Card className="CurrentStockCard">
            <Accordion.Toggle as={Card.Header} variant="link" eventKey={currentStock.id}>
                <Container>
                    <Row>
                        <Col>Symbol</Col>
                        <Col>Current</Col>
                        <Col>Average Cost</Col>
                        <Col>Quantity</Col>
                        <Col>Equity</Col>
                        <Col>Return</Col>
                        <Col>Pct</Col>
                    </Row>
                    <Row>
                        <Col>{currentStock.stock}</Col>
                        <Col>${currentStock.current.toFixed(2)}</Col>
                        <Col>${cost.toFixed(2)}</Col>
                        <Col>{quantity}</Col>
                        <Col style={{ color: color }}>${equity.toFixed(2)}</Col>
                        <Col style={{ color: color }}>${totalReturn.toFixed(2)}</Col>
                        <Col style={{ color: color }}>{pct.toFixed(2)}%</Col>
                    </Row>
                </Container>
            </Accordion.Toggle>

            <Accordion.Collapse eventKey={currentStock.id}>
                <Card.Body className="CurrentStockCard__body">
                    <Container>
                        <Row>
                            <Col>Date</Col>
                            <Col>Price</Col>
                            <Col>Quantity</Col>
                            <Col>Total</Col>
                        </Row>
                        {trans}
                    </Container>
                    <AddStockTrade tran_id={currentStock.id}/>
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    )
}

export default CurrentStockCard
