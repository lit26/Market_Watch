import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

// pages
import StockPage from './pages/StockPage'
import OptionPage from './pages/OptionPage'
import WatchlistPage from './pages/WatchlistPage'

// components
 import Header from './components/Header'
 import Footer from './components/Footer'

function App() {
  return (
    <Router>
    <div className="App" style={{minWidth:'950px'}}>
      <Header />
      <Switch>
          <Route path="/" exact component={StockPage} />
          <Route path="/stock" component={StockPage} />
          <Route path="/option" component={OptionPage} />
          <Route path="/watchlist" component={WatchlistPage} />
      </Switch>
      <Footer />
    </div>
    </Router>
  );
}

export default App;
