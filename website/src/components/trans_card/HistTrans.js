import React from 'react'
import {Row, Col} from 'react-bootstrap';

function HistTrans(props) {
    var price_color = {color:'#fff'};
    var total_return = props.total_return;
    if(total_return>0){
        price_color = {color:'green'};
    }else if(total_return<0){
        price_color = {color:'red'};
    }
    
    return (
        <Row>
            <Col>{props.symbol}</Col>
            <Col style={price_color}>${total_return.toFixed(2)}</Col>
            <Col style={price_color}>{(props.pct_return*100).toFixed(2)}%</Col>
        </Row>
    );
}
  
export default HistTrans;