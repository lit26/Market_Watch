import React, { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap';
import './Historystockcard.css'

function HistoryStockCard({ historyStock, totalReturn, pctReturn}) {
    const [color, setColor] = useState('#fff');

    useEffect(() => {
        if (totalReturn > 0) {
            setColor('green')
        } else if (totalReturn < 0) {
            setColor('red')
        }
    }, [totalReturn])

    return (
        <Row className="histRow">
            <Col>{historyStock.stock}</Col>
            <Col style={{ color: color }}>${totalReturn.toFixed(2)}</Col>
            <Col style={{ color: color }}>{(pctReturn*100).toFixed(2)}%</Col>
        </Row>
    )
}

export default HistoryStockCard
