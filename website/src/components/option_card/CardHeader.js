import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';

function CardHeader({ symbol, type, current, avg_cost, quantity, total_return, pct_return }) {
    var price_color = { color: '#fff' };
    if (total_return > 0) {
        price_color = { color: 'green' };
    } else if (total_return < 0) {
        price_color = { color: 'red' };
    }

    return (
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
                <Col>{symbol} {type}</Col>
                <Col>${current.toFixed(2)}</Col>
                <Col>${avg_cost.toFixed(2)}</Col>
                <Col>{quantity}</Col>
                <Col style={price_color}>${total_return.toFixed(2)}</Col>
                <Col style={price_color}>{(pct_return * 100).toFixed(2)}%</Col>
            </Row>
        </Container>
    );
}

export default CardHeader;