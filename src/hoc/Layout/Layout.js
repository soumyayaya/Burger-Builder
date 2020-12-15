import React, { Component } from 'react';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import Auxiliary from '../Auxiliary/Auxiliary';
import classes from './Layout.css';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends Component{

    state = {
        showSideDrawer: true
    }

    sideDrawerColsedHandler = () => {
        this.setState({showSideDrawer: false});
    }

    /*we shouldn't use showSideDrawer : !this.state.showSideDrawer in set state*/
    sideDrawerToggleHandler = () => {
        this.setState((prevState) => {
            return {showSideDrawer: !prevState.showSideDrawer};
        });
    }

    render () {
        return(
            <Auxiliary>
                <Toolbar drawerToggleClicked={this.sideDrawerToggleHandler}></Toolbar>
                <SideDrawer 
                open = {this.state.showSideDrawer}
                closed = {this.sideDrawerColsedHandler}></SideDrawer>
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Auxiliary>
        )
    }
}

export default Layout;