import React,{Component} from 'react'
import {Form, Button } from 'react-bootstrap';
import './Addstocktrade.css'
import axios from 'axios'

export default class AddStockTrade extends Component {
    constructor(props){
        super(props);
        this.state = {
            'date': '',
            'price': '',
            'quantity': '',
            'type': '',
        };
    }
    handleChange = event => {
        let name = event.target.name;
        let value = event.target.value
        if (name === 'price' || name === 'quantity'){
            value = parseFloat(value)
        }
        this.setState({
            [name]: value
        })
    }
    handleSubmit = event =>{
        event.preventDefault()
        let trade_id = this.props.tran_id;
        let error = false;
        if (Object.keys(this.state).length === 0) {
            alert("No new transaction.");
            error = true;
        }
        let data = this.state;
        let data_key = Object.keys(data);

        // check information missing
        for (let i = 0; i < data_key.length; i++) {
            let key = data_key[i];
            if (data[key] === null ) {
                alert('Missing ' + key);
                error = true;
                break
            }
        }
        // upload new transaction
        if (error === false) {
            let postData = this.state;
            postData = { "transaction": postData };
            axios.post('/api/history/transaction/'+trade_id, postData)
                .then(response => {
                    console.log(response)
                    window.location.reload(false);
                })
                .catch(error => {
                    console.log(error)
                })
            }
    }

    render(){
        return (
            <Form onSubmit={this.handleSubmit} className="stockForm">
                <Form.Group controlId="formBasicDate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control name="date"
                                type="date" 
                                onChange={this.handleChange}/>
                </Form.Group>

                <Form.Group controlId="formBasicPrice">
                    <Form.Label>Price</Form.Label>
                    <Form.Control name="price" 
                                type="text" 
                                onChange={this.handleChange}/>
                </Form.Group>

                <Form.Group controlId="formBasicQuantity">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control name="quantity"
                                type="text" 
                                onChange={this.handleChange}/>
                </Form.Group>

                <Form.Group controlId="formBuySell">
                    <Form.Label>Buy / Sell</Form.Label>
                    <Form.Control as="select" 
                            name='type'
                            onChange={this.handleChange}>
                    <option value='null'>Choose</option>
                    <option value='Buy'>Buy</option>
                    <option value='Sell'>Sell</option>
                </Form.Control>
                </Form.Group>

                <Button variant="secondary" type="submit" style={{margin:'0px'}}>
                    Add
                </Button>
            </Form>
  
        )
    }
}
