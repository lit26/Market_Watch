import React from "react";
// import logo from './logo.svg';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import './components/custom.css'

import Header from './components/Header'
import Footer from './components/Footer'
import StockPage from './components/Layout'
import OptionPage from './components/Layout_option'
import Nav from './Nav'

import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

function App() {
  var winHeight = window.innerHeight;
  return (
    <Router>
    <div className="App" style={{height: winHeight}}>
      <Nav />
      <Header />
      <Switch>
        <Route path="/" exact component={StockPage} />
        <Route path="/stock" component={StockPage} />
        <Route path="/option" component={OptionPage} />
      </Switch>
      <Footer />
    </div>
    </Router>
  );
}

export default App;
