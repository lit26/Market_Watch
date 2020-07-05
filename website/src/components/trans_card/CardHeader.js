import React from 'react'
import { Container, Row, Col} from 'react-bootstrap';

function CardHeader(props) {
    var total_return = props.total_return;
    var pct_return = props.pct_return*100;
    var price_color = {color:'#fff'};
    if(total_return>0){
        price_color = {color:'green'};
    }else if(total_return<0){
        price_color = {color:'red'};
    }
    
    return (
        <Container>
            <Row>
                <Col>Symbol</Col>
                <Col>Current</Col>
                <Col>Average Cost</Col>
                <Col>Equity</Col>
                <Col>Return</Col>
                <Col>Pct</Col>
            </Row>
            <Row>
                <Col>{props.symbol}</Col>
                <Col>${props.current}</Col>
                <Col>${props.avg_cost.toFixed(2)}</Col>
                <Col style={price_color}>${props.total.toFixed(2)}</Col>
                <Col style={price_color}>${total_return.toFixed(2)}</Col>
                <Col style={price_color}>{pct_return.toFixed(2)}%</Col>
            </Row>
        </Container>
    );
}
  
export default CardHeader;