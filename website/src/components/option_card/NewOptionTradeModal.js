import React, {Component} from 'react'
import { Form, Button, Modal} from 'react-bootstrap';
import axios from 'axios';

const buttonStyle={
    margin: '10px',
    width: '100%'
}
export default class NewOptionTradeModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            show:false,
            'date': '',
            'stock': '',
            'buySell': '',
            'price': '',
            'quantity': '',
            'type': '',
            'strikeprice': '',
            'expiredate': ''
        };
    }

    handleChange = event =>{
        const name = event.target.name;
        var value = event.target.value
        this.setState({
            [name]:value
        })
    }

    handleSubmit = event => {
        event.preventDefault()
        var postTrans = {
            'stock': this.state.stock,
            'transaction': [{
                'date': this.state.date,
                'price': parseFloat(this.state.price),
                'quantity': parseFloat(this.state.quantity),
                'type': this.state.buySell
            }],
            'type': this.state.type,
            'strikeprice': parseFloat(this.state.strikeprice),
            'expiredate': this.state.expiredate
        }
        axios.post('/api/option/transaction', postTrans)
            .then(response => {
                console.log(response);
                window.location.reload(false);
            })
            .catch(error =>{
                console.log(error)
            })
        this.setState({
            show: false,
            'date': '',
            'stock': '',
            'buySell': '',
            'price': '',
            'quantity': '',
            'type': '',
            'strikeprice': '',
            'expiredate':''
        })
    }

    handleShow = () =>{
        this.setState({
            show:true
        })
    }

    handleClose = () =>{
        this.setState({
            show:false
        })
    }

    render() {
        return (
            <>
            <Button variant="secondary" onClick={this.handleShow}
                style={buttonStyle}>
                Add Trade
            </Button>

            <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Add New Trade</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="formBasicDate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control name="date"
                                type="date" 
                                onChange={this.handleChange}/>
                </Form.Group>
                <Form.Group controlId="formBasicStock">
                    <Form.Label>Stock</Form.Label>
                    <Form.Control name="stock"
                                type="text" 
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
                <Form.Control controlId="formBasicbuySell"
                            as="select" 
                            name='buySell'
                            onChange={this.handleChange}>
                    <option value='null'>Choose</option>
                    <option value='Buy'>Buy</option>
                    <option value='Sell'>Sell</option>
                </Form.Control>
                <Form.Group controlId="formBasicType">
                    <Form.Label>Type</Form.Label>
                    <Form.Control name="type"
                                type="text" 
                                onChange={this.handleChange}/>
                </Form.Group>
                <Form.Group controlId="formStrikePrice">
                    <Form.Label>Strike Price</Form.Label>
                    <Form.Control name="strikeprice"
                                type="text" 
                                onChange={this.handleChange}/>
                </Form.Group>
                <Form.Group controlId="formExpireDate">
                    <Form.Label>Expiration Date</Form.Label>
                    <Form.Control name="expiredate"
                                type="date" 
                                onChange={this.handleChange}/>
                </Form.Group>
                
                <Button variant="warning" type="submit">
                    Submit
                </Button>
                </Form>
                </Modal.Body>
            </Modal>
            </>
        );
    }
}