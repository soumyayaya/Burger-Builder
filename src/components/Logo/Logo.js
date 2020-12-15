import React from 'react';
import burgerLogo from '../../assests/images/28.1 burger-logo.png.png';
import classes from './Logo.css';

const logo = (props) => (
    <div className={classes.Logo} style = {{height: props.height}}>
        <img src={burgerLogo} alt = "My Burger"/>
    </div>
);

export default logo;