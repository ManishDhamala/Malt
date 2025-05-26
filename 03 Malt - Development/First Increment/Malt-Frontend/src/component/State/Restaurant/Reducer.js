import * as actionTypes from "./ActionType"

const initialState = {
    restaurants: [],
    usersRestaurant: null,
    restaurant: null,
    loading: false,
    error: null,
    categories: [],
    searchedRestaurants: [] // Added for storing searched restaurants
};


const restaurantReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CREATE_RESTAURANT_REQUEST:
        case actionTypes.GET_ALL_RESTAURANT_REQUEST:
        case actionTypes.DELETE_RESTAURANT_REQUEST:
        case actionTypes.UPDATE_RESTAURANT_REQUEST:
        case actionTypes.GET_RESTAURANT_BY_ID_REQUEST:
        case actionTypes.CREATE_CATEGORY_REQUEST:
        case actionTypes.GET_RESTAURANT_CATEGORY_REQUEST:
        case actionTypes.DELETE_CATEGORY_REQUEST:
        case actionTypes.SEARCH_RESTAURANT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };

        case actionTypes.CREATE_RESTAURANT_SUCCESS:
            return {
                ...state,
                loading: false,
                usersRestaurant: action.payload
            };

        case actionTypes.GET_ALL_RESTAURANT_SUCCESS:
            return {
                ...state,
                loading: false,
                restaurants: action.payload,
                searchedRestaurants: action.payload //  Initially set to all restaurants
            };

        case actionTypes.GET_RESTAURANT_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                restaurants: action.payload
            };

        case actionTypes.GET_RESTAURANT_BY_USER_ID_SUCCESS:
        case actionTypes.UPDATE_RESTAURANT_STATUS_SUCCESS:
        case actionTypes.UPDATE_RESTAURANT_SUCCESS:
            return {
                ...state,
                loading: false,
                usersRestaurant: action.payload
            };


        case actionTypes.DELETE_RESTAURANT_SUCCESS:
            return {
                ...state,
                error: null,
                loading: false,
                restaurants: state.restaurants.filter(
                    (item) => item.id !== action.payload
                ),
                usersRestaurant: state.usersRestaurant
                    ? state.usersRestaurant.id !== action.payload
                        ? state.usersRestaurant
                        : null
                    : null
            };


        case actionTypes.CREATE_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                categories: [...state.categories, action.payload]
            };

        case actionTypes.GET_RESTAURANT_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                categories: action.payload
            };

        case actionTypes.DELETE_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                categories: state.categories.filter(category => category.id !== action.payload)
            };


        case actionTypes.SEARCH_RESTAURANT_SUCCESS: //  Added for Search Restaurant success
            return {
                ...state,
                loading: false,
                searchedRestaurants: action.payload
            };


        case actionTypes.GET_ALL_RESTAURANT_FAIL:
            return {
                ...state,
                restaurants: [],
                loading: false,
                error: action.payload
            }


        case actionTypes.RESET_RESTAURANT_STATE:
            return {
                ...initialState,
                restaurants: [],
                usersRestaurant: null,
                restaurant: null,
                categories: [],
                searchedRestaurants: [],
                loading: false,
                error: null,
            };


        case actionTypes.CREATE_RESTAURANT_FAIL:
        case actionTypes.DELETE_RESTAURANT_FAIL:
        case actionTypes.UPDATE_RESTAURANT_FAIL:
        case actionTypes.GET_RESTAURANT_BY_ID_FAIL:
        case actionTypes.CREATE_CATEGORY_FAIL:
        case actionTypes.GET_RESTAURANT_CATEGORY_FAIL:
        case actionTypes.DELETE_CATEGORY_FAIL:
        case actionTypes.SEARCH_RESTAURANT_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            };



        default:
            return state;

    }
}

export default restaurantReducer;