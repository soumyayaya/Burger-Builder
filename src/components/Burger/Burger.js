import React from 'react';

import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

/*Burger ingredeints are passed through props, now we are receiving an object here and not an array
hence, we need to convert values of an object into values of an array */


/* Object.keys() extracts keys from a given object and transforms that into an array,
    So our array will contain strings ('cheese', 'meat', etc. ) 
    Values are not part of the array*/


/*How can we find out if we have got ingredients or not?
We can use reduce function, a built-in array function which allows 
to transforms an array into something else */    
const burger = (props) =>{
    
    let transformedIngredients = Object.keys(props.ingredients).map(igKey => {
        return [...Array(props.ingredients[igKey])].map(( _, i) => {
            return <BurgerIngredient key = {igKey+i} type = {igKey} />; 
        });
    })
    .reduce((arr, el) => {                   //arr : prevValue
        return arr.concat(el)                // el : nextValue 
    }, []) ;                                 // [] : initial value

    if(transformedIngredients.length === 0){
        transformedIngredients = <p>Please start adding ingredients!</p>
    }
    return(                                                             
        <div className = {classes.Burger}>
            <BurgerIngredient type="bread-top"/>
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom"/>
        </div>
    );
};

export default burger;