import React from 'react'
import './Header.css'
import {Link} from "react-router-dom";

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
            </div>
        </div>
    )
}

export default Header
