import React, {Component} from 'react'
import { Container, Row, Col, Form, Button} from 'react-bootstrap';
import axios from 'axios';

const inputStyle={
    height: "30px",
    padding: "0.2rem 0.75rem"
}
export default class CardBody extends Component {
    constructor(props){
        super(props);
        this.state = {
            
        };
    }

    handleChange = event =>{
        const name = event.target.name;
        var trade_id = name.split('_');
        var info = trade_id[0];
        trade_id = trade_id[1];
        var value = event.target.value;
        var stateCopy = Object.assign({}, this.state);
        if (stateCopy[trade_id]===undefined){
            stateCopy[trade_id] = {
                'date':null,
                'price':null,
                'current':null,
                'quantity':null,
                'type': null
            };
        }
        if (info === 'price' || info === 'quantity'){
            value = parseFloat(value)
        }
        stateCopy[trade_id][info] = value
        this.setState(stateCopy);
    }

    updateCurrent = event => {
        event.preventDefault();
        var error = false;
        var trade_id = parseInt(event.target.name.split('_')[1]);
        if(Object.keys(this.state).length === 0){
            alert("No new transaction.");
            error = true;
        }
        if(error === false){
            var postData = this.state[trade_id].current;
            postData = {'current': parseFloat(postData)}
            axios.post('/api/option/current/'+trade_id, postData)
                .then(response => {
                    console.log(response)
                    window.location.reload(false);
                })
                .catch(error =>{
                    console.log(error)
                })
        }
    }

    handleClick = event =>{
        var trade_id = parseInt(event.target.name.split('_')[1]);
        var postDate = {'trade_id':trade_id}
        axios.post('/api/option/close/', postDate)
            .then(response => {
                console.log(response)
                window.location.reload(false);
            })
            .catch(error =>{
                console.log(error)
            })
    }

    handleSubmit = event => {
        event.preventDefault();
        var trade_id = event.target.name;
        trade_id = trade_id.split('_')[1];
        
        var error = false;
        if(Object.keys(this.state).length === 0){
            alert("No new transaction.");
            error = true;
        }
        var data = this.state[parseInt(trade_id)];
        var data_key = Object.keys(data);

        // check information missing
        for(let i=0; i<data_key.length; i++){
            var key = data_key[i];
            if(data[key] === null && key !=='current'){
                alert('Missing '+key);
                error = true;
                break
            }
        }

        // upload new transaction
        if(error === false){
            // var postData = {"transaction": this.state[parseInt(trade_id)]};
            var postData = this.state[parseInt(trade_id)];
            delete postData['current']
            postData = {"transaction":postData};
            axios.post('/api/option/transaction/'+trade_id, postData)
                .then(response => {
                    console.log(response)
                    window.location.reload(false);
                })
                .catch(error =>{
                    console.log(error)
                })
        }
    }

    render() {
        var trans = [];
        var transactions = this.props.transactions;

        for (let i=0; i<transactions.length;i++){
            var total = transactions[i].price * transactions[i].quantity;
            if(transactions[i].type==='Buy'){
                total = -total
            }
            trans.push(
                <Row key={this.props.symbol+"_"+i}>
                    <Col xs={4}>{transactions[i].date}</Col>
                    <Col xs={2}>${transactions[i].price.toFixed(2)}</Col>
                    <Col xs={2}>{transactions[i].quantity}</Col>
                    <Col xs={2}>${total.toFixed(2)}</Col>
                    <Col ></Col>
                </Row>
                )
        }
        var trans_id = this.props.trans_id;

        return (
            <Container>
                <Form name={"updatePrice_"+trans_id}
                        onSubmit={this.updateCurrent} >
                <Row className="infoRow">
                    <Col style={inputStyle}>Current</Col>
                    <Col>
                    <Form.Control style={inputStyle}
                                name={"current_"+trans_id}
                                placeholder={this.props.current}
                                onChange={this.handleChange}
                                type='text' />
                                
                    </Col>
                    <Col>
                    <Button style={inputStyle}
                                variant="warning" 
                                type="submit">Update</Button>
                    </Col>
                    <Col style={inputStyle}>Equity</Col>
                    <Col style={inputStyle}>${(this.props.total*100).toFixed(2)}</Col>
                    <Col></Col>
                </Row>
                </Form>
                <hr />
                <Row>
                    <Col xs={4}>Date</Col>
                    <Col xs={2}>Price</Col>
                    <Col xs={2}>Quantity</Col>
                    <Col xs={2}>Total</Col>
                    <Col>
                    <Button name={"close_"+trans_id}
                            variant="warning" 
                            type="submit" 
                            onClick={this.handleClick}>Close</Button>
                    </Col>
                </Row>
                {trans}
                
                <Form name={'addtrade_'+trans_id}
                      onSubmit={this.handleSubmit} >
                    <Row>
                        <Col xs={4}>
                        <Form.Control name={'date_'+trans_id} 
                                    type='date' 
                                    onChange={this.handleChange}/>
                        </Col>
                        <Col xs={2}>
                        <Form.Control name={'price_'+trans_id} 
                                    type='text'
                                    onChange={this.handleChange}/>
                        </Col>
                        <Col xs={2}>
                        <Form.Control name={'quantity_'+trans_id} 
                                    type='text'
                                    onChange={this.handleChange}/>
                        </Col>
                        <Col xs={2}>
                        <Form.Control as="select" 
                                    name={'type_'+trans_id}
                                    onChange={this.handleChange}>
                            <option value='null'>Choose</option>
                            <option value='Buy'>Buy</option>
                            <option value='Sell'>Sell</option>
                        </Form.Control>
                        </Col>
                        <Col>
                        <Button variant="secondary" type="submit">Add</Button> 
                        </Col>
                    </Row>
                </Form>
            </Container>
        );
    }
}