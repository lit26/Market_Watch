import React, {Component} from 'react'
import { Container, Row, Col, Form, Button} from 'react-bootstrap';
import axios from 'axios';

export default class BuyNew extends Component {
    constructor(props){
        super(props);
        this.state = {
            'date': '',
            'stock': '',
            'price': '',
            'quantity': '',
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
                'type':'Buy'
            }]
        }
        axios.post('/api/history/transaction', postTrans)
        .then(response => {
            console.log(response);
            window.location.reload(false);
        })
        .catch(error =>{
            console.log(error)
        })
        this.setState({
            'date': '',
            'stock': '',
            'price': '',
            'quantity': '',
        })
    }

    render() {
        return (
            <Container>
                <Form onSubmit={this.handleSubmit} >
                    <Row>
                        <Col xs={4}>
                        <Form.Control name='date' 
                                    type='date' 
                                    onChange={this.handleChange}/>
                        </Col>
                        <Col xs={2}>
                        <Form.Control name='stock' 
                                    type='text'
                                    placeholder='stock'
                                    onChange={this.handleChange}/>
                        </Col>
                        <Col xs={2}>
                        <Form.Control name='price' 
                                    type='text'
                                    placeholder='price'
                                    onChange={this.handleChange}/>
                        </Col>
                        <Col xs={2}>
                        <Form.Control name='quantity'
                                    type='text'
                                    placeholder='quantity'
                                    onChange={this.handleChange}/>
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