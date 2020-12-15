import React from 'react';
import classes from './NavigationItem.css';
import { NavLink } from 'react-router-dom';
/*import navigationItems from '../NavigationItems';*/

const navigationItem = (props) => (
    <li className = {classes.NavigationItem}>
        <NavLink 
        to={props.link}
        exact={this.exact} 
        activeClassName={classes.active}>{props.children}</NavLink>
    </li>
);

export default navigationItem;