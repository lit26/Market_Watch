import React, { useState, useEffect } from 'react'
import { Accordion, Card, Container, Row, Col, Button } from 'react-bootstrap';
import './Currentoptioncard.css';
import axios from 'axios';
import AddOptionTrade from './AddOptionTrade'
import UpdateCurrent from './UpdateCurrent'

function CurrentOptionCard({ currentOption, totalCost, quantity, totalReturn }) {
    const [cost, setCost] = useState(0);
    const [pct, setPct] = useState(0);
    const [color, setColor] = useState('#fff');
    const [breakEven, setBreakEven] = useState(0)
    const [trans, setTrans] = useState([])

    useEffect(() => {
        let currentPrice = currentOption.current;
        let avgCost = totalCost / quantity;
        setCost(avgCost);
        setPct((currentPrice - avgCost) * 100 / avgCost);
        if (totalReturn > 0) {
            setColor('green')
        } else if (totalReturn < 0) {
            setColor('red')
        }
        let breakEvenPrice = currentOption.strikeprice;
        if (currentOption.type === "Call") {
            breakEvenPrice = breakEvenPrice + avgCost;
        } else if (currentOption.type === "Put") {
            breakEvenPrice = breakEvenPrice - avgCost;
        }
        setBreakEven(breakEvenPrice);
        let optionTrans = [];
        for (let i = 0; i < currentOption.transaction.length; i++) {
            let tran = currentOption.transaction[i];
            let total = tran.price * tran.quantity
            if (tran.type === 'Buy') {
                total = -total;
            }
            optionTrans.push(
                <Row key={i}>
                    <Col>{tran.date}</Col>
                    <Col>${tran.price.toFixed(2)}</Col>
                    <Col>{tran.quantity}</Col>
                    <Col>${total.toFixed(2)}</Col>
                </Row>
            )
        }
        setTrans(optionTrans)
    }, [currentOption, quantity, totalCost, totalReturn])

    const handleClose = (item) => {
        let postData = { 'trade_id': item }
        axios.post('/api/option/close/', postData)
            .then(response => {
                window.location.reload(false);
            })
            .catch(error => {
                console.log(error)
            })
    }

    return (
        <Card className="CurrentOptionCard">
            <Accordion.Toggle as={Card.Header} variant="link" eventKey={currentOption.id}>
                <Container>
                    <Row>
                        <Col>Type</Col>
                        <Col>Current</Col>
                        <Col>Average Cost</Col>
                        <Col>Quantity</Col>
                        <Col>Return</Col>
                        <Col>Pct</Col>
                    </Row>
                    <Row>
                        <Col>{currentOption.stock} {currentOption.type}</Col>
                        <Col>${currentOption.current}</Col>
                        <Col>${cost.toFixed(2)}</Col>
                        <Col>{quantity}</Col>
                        <Col style={{ color: color }}>${totalReturn.toFixed(2)}</Col>
                        <Col style={{ color: color }}>{pct.toFixed(2)}%</Col>
                    </Row>
                </Container>
            </Accordion.Toggle>

            <Accordion.Collapse eventKey={currentOption.id}>
                <Card.Body className="CurrentOptionCard__body">
                    <Container>
                        <div className="optionCard__body">
                            <div className="optionCard__info">
                                <div className="optionCard__infoLeft">
                                    <div className="optionCard__infoRow">
                                        <div className="optionCard__infoTitle">
                                            <p>Market Value</p>
                                        </div>
                                        <div className="optionCard__infoDetail">
                                            <p>${(currentOption.current * quantity * 100).toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="optionCard__infoRow">
                                        <div className="optionCard__infoTitle">
                                            <p>Total Cost</p>
                                        </div>
                                        <div className="optionCard__infoDetail">
                                            <p>${(totalCost * 100).toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="optionCard__infoRow">
                                        <div className="optionCard__infoTitle">
                                            <p>Expiry Date</p>
                                        </div>
                                        <div className="optionCard__infoDetail">
                                            <p>{currentOption.expiredate}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="optionCard__infoLeft">
                                    <div className="optionCard__infoRow">
                                        <div className="optionCard__infoTitle">
                                            <p>Strike Price</p>
                                        </div>
                                        <div className="optionCard__infoDetail">
                                            <p>${currentOption.strikeprice}</p>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="optionCard__infoRow">
                                        <div className="optionCard__infoTitle">
                                            <p>Break Even</p>
                                        </div>
                                        <div className="optionCard__infoDetail">
                                            <p>${breakEven.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="optionCard__infoRight">
                                    <div className="optionCard__infoRow">
                                        <h6>Current</h6>
                                    </div>
                                    <div className="optionCard__infoRow">
                                        <UpdateCurrent id={currentOption.id} currentPrice={currentOption.current} />
                                    </div>
                                    <div className="optionCard__infoRow">
                                        <Button variant="secondary"
                                            onClick={() => handleClose(currentOption.id)}>Close</Button>
                                    </div>
                                </div>
                            </div>
                            <div className='optionCard__trades'>
                                <div className="optionCard__transCard">
                                    <Row>
                                        <Col><strong>Date</strong></Col>
                                        <Col><strong>Price</strong></Col>
                                        <Col><strong>Quantity</strong></Col>
                                        <Col><strong>Total</strong></Col>
                                    </Row>
                                    {trans}
                                </div>
                                <AddOptionTrade tran_id={currentOption.id}/>
                            </div>
                        
                        </div>
                    </Container>
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    )
}

export default CurrentOptionCard
