import React from 'react';
import  {Link} from 'react-router-dom';
import { Button } from 'react-bootstrap';

const linkStyle={
    padding: "0.2rem 0.75rem",
    background: "none",
    border: 0
}
function Nav(){
    return (
        <nav>
            <ul className="nav-links">
                <Link to="/stock">
                    <Button style={linkStyle}>Stock</Button>
                </Link>
                <Link to="/option">
                    <Button style={linkStyle}>Option</Button>
                </Link>
            </ul>
        </nav>
    )
}

export default Nav;