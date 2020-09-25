import React from 'react'
import {Link} from "react-router-dom";
import './Header.css'

function Header() {
    return (
        <div className="header">
            <div className="header__left">
                <h1>Market Watch</h1>
            </div>
            <div className="header__right">
                <Link to="/stock">
                    <div>Stock</div>
                </Link>
                <Link to="/option">
                    <div>Option</div>
                </Link>
                <Link to="/watchlist">
                    <div>Watchlist</div>
                </Link>
            </div>
        </div>
    )
}

export default Header
