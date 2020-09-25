import React, { Component } from 'react'
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import './Currentoptioncard.css'

export default class CardBody extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    handleChange = event =>{
        const name = event.target.name;
        var value = event.target.value
        this.setState({
            [name]:value
        })
    }

    updateCurrent = event => {
        event.preventDefault();
        var error = false;
        var trade_id = parseInt(this.props.id);
        if (this.state.length === 0) {
            alert("No new transaction.");
            error = true;
        }
        if (error === false) {
            var postData = this.state.currentPrice;
            postData = { 'current': parseFloat(postData) }
            axios.post('/api/option/current/' + trade_id, postData)
                .then(response => {
                    console.log(response)
                    window.location.reload(false);
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    render() {
        return (
            <Form onSubmit={this.updateCurrent} >
                <Form.Control className="optionCard__infoTitle currentInput"
                    name="currentPrice"
                    placeholder={this.props.currentPrice}
                    onChange={this.handleChange}
                    type='text' />

                <Button className="optionCard__infoDetail currentInput"
                    variant="warning"
                    type="submit">Update</Button>
            </Form>

        );
    }
}