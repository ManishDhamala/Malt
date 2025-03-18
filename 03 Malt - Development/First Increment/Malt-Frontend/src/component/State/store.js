import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { authReducer } from "./Authentication/Reducer";
import { thunk } from "redux-thunk";
import restaurantReducer from "./Restaurant/Reducer";
import menuItemReducer from "./Menu/Reducer";
import cartReducer from "./Cart/Reducer";
import orderReducer from "./Order/Reducer";
import restaurantOrderReducer from "./Restaurant Order/Reducer";


const persistedJwt = localStorage.getItem("jwt");
const persistedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

const initialState = {
    auth: {
        user: persistedUser,
        jwt: persistedJwt,
        favourites: [],
        isLoading: false,
        error: null,
    },
    cart: {
        cartItems: [],
    }
};

const rootReducer = combineReducers({
    auth: authReducer,
    restaurant: restaurantReducer,
    menu: menuItemReducer,
    cart: cartReducer,
    order: orderReducer,
    restaurantOrder: restaurantOrderReducer
})


export const store = legacy_createStore(rootReducer, initialState, applyMiddleware(thunk));