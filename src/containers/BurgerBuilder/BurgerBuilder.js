import React, {  Component } from 'react';
//import { render } from 'react-dom';
import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
//import Spinners from '../../components/UI/Spinner/Spinner';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import auxiliary from '../../hoc/Auxiliary/Auxiliary';



/*We typically name constants in capital when we want to declare them globally */
/*INGRIDIENT_PRICES is a javascript object */
const INGRIDIENT_PRICES = {
    salad : 0.5,
    cheese : 0.4,
    meat: 1.3,
    bacon : 0.7
};

class BurgerBuilder extends Component{
    /*can be used to set state*/
    // constructor(props){
    //     super(props);                        
    //     this.state = {}            
    // }

    /*Inside this 'state', we'll have an object, named ingredients, which will contain key-value pairs
    where, key = items and value = amount of items */
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
     }

     componentDidMount () {
         axios.get('https://react-my-burger-94752.firebaseio.com/ingredients.json')
         .then(response=> {
            this.setState({ingredients: response.data});
         })
         .catch(error => {
             this.setState({error: true});
         });
     }

    /*Now, our goal is to pass this array into a burger, i.e., we want to give our burger components these ingredients */


    /*We are mapping the key values, i.e., strings and then we are returning new values ,i.e., number of items and replacing the prev one */
    /*We are introducing reduce here to make the sum of values (no. of items)*/ 
    updatePurchaseState (ingredients) {
        //  const ingredients = {
        //     ...this.state.ingredients
        //  };
         const sum = Object.keys ( ingredients )
         .map( igKey => {
             return ingredients[igKey];
         })
         .reduce((sum, el) => {
             return sum + el;
         },0);
         this.setState({purchasable : sum > 0});
     }

    /*We will include two methods */
    /*New object should be created in an immutable form, so updatedIngredients is created
        and we are using spread operator to distribute the properties of old ingredients state to new object */
    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        
        const updatedIngredients = {
            ...this.state.ingredients
        };

        updatedIngredients[type] = updatedCount;
        const priceAddition = INGRIDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;

        this.setState({totalPrice : newPrice, ingredients : updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount <= 0){
            return;
        }
        const updatedCount = oldCount - 1;
        
        const updatedIngredients = {
            ...this.state.ingredients
        };

        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGRIDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;

        this.setState({totalPrice : newPrice, ingredients : updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    purchaseHandler = () => {
        this.setState({purchasing : true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        //alert('You Continue');
        // this.setState({loading: true});
        // const order = {
        //     ingredients: this.state.ingredients,
        //     price: this.state.totalPrice,
        //     customer: {
        //         name: 'Max',
        //         address: {
        //             street: 'teststreet1',
        //             zipcode: '12345',
        //             country: 'India'
        //         },
        //         email: 'test@test.com'
        //     },
        //     deliveryMethod: 'fastest'
        // }
        // axios.post('/orders.json', order)
        // .then(response=> {
        //     this.setState({loading: false, purchasing: false});
        //     //console.log(response)
        // })
        // .catch(error=> {
        //     this.setState({loading: false, purchasing: false});
        //     //console.log(error)
        // });
        const queryParams = [];
        for(let i in this.state.ingredients){
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push('price=' + this.state.totalPrice);
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });
    }

    render() {

        const disabledInfo = {
            ...this.state.ingredients
        };

        for(let key in disabledInfo){
            disabledInfo[key] = (disabledInfo[key] <= 0)
        }
        let orderSummary = null;
        
            let burger = this.state.error ? <p>Ingredients can not be loaded!</p> : <Spinner></Spinner>;
            if(this.state.ingredients){
                burger = (
                    <auxiliary>
                        <Burger ingredients = {this.state.ingredients}/>  
                        
                        <BuildControls 
                            ingredientAdded = {this.addIngredientHandler}
                            ingredientRemoved = {this.removeIngredientHandler}
                            disabled = {this.disabledInfo}
                            purchasable = {this.state.purchasable}
                            ordered = {this.purchaseHandler}
                            price = {this.state.totalPrice}
                            />
                    </auxiliary>
                );
                orderSummary = <OrderSummary 
                ingredients={this.state.ingredients}
                price = {this.state.totalPrice}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaceContinued={this.purchaseContinueHandler}></OrderSummary>;
            }
            if(this.state.loading){
                orderSummary = <Spinner></Spinner>
            }

        return(
            <Auxiliary>

                <Modal show = {this.state.purchasing} ModalClosed = {this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
                
            </Auxiliary>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);
