import * as actionTypes from './ActionType';

const initialState = {
    menuItems: [],  // List of all menu items
    loading: false, // Indicates if a request is in progress
    error: null,    // Stores any error messages
    search: [],     // Stores search results
    message: null   // Provides feedback messages (e.g., success alerts)
};

const menuItemReducer = (state = initialState, action) => {
    switch (action.type) {

        // REQUEST CASES (Set Loading to true)
        case actionTypes.CREATE_MENU_ITEM_REQUEST:
        case actionTypes.GET_MENU_ITEMS_BY_RESTAURANT_ID_REQUEST:
        case actionTypes.DELETE_MENU_ITEM_REQUEST:
        case actionTypes.SEARCH_MENU_ITEM_REQUEST:
        case actionTypes.UPDATE_MENU_ITEMS_AVAILABILITY_REQUEST:
        case actionTypes.UPDATE_MENU_ITEMS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                message: null
            };

        // SUCCESS CASES
        case actionTypes.CREATE_MENU_ITEM_SUCCESS:
            return {
                ...state,
                loading: false,
                menuItems: [...state.menuItems, action.payload], // Add new menu item
                message: "Food created successfully!"
            };

        case actionTypes.GET_MENU_ITEMS_BY_RESTAURANT_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                menuItems: action.payload // Load menu items for a specific restaurant
            };

        case actionTypes.DELETE_MENU_ITEM_SUCCESS:
            return {
                ...state,
                loading: false,
                menuItems: state.menuItems.filter((menuItem) => menuItem.id !== action.payload), // Remove item by ID
                message: "Food deleted successfully!"
            };

        case actionTypes.SEARCH_MENU_ITEM_SUCCESS:
            return {
                ...state,
                loading: false,
                search: action.payload // Store search results
            };

        case actionTypes.UPDATE_MENU_ITEMS_AVAILABILITY_SUCCESS:
            return {
                ...state,
                loading: false,
                menuItems: state.menuItems.map((menuItem) =>
                    menuItem.id === action.payload.id
                        ? action.payload // Update availability status
                        : menuItem
                ),
                message: "Food availability updated successfully!"
            };

        case actionTypes.UPDATE_MENU_ITEMS_SUCCESS:
            return {
                ...state,
                loading: false,
                menuItems: state.menuItems.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                ),
                message: "Food updated successfully!"
            };

        // FAIL CASES (Handle Errors)
        case actionTypes.CREATE_MENU_ITEM_FAIL:
        case actionTypes.GET_MENU_ITEMS_BY_RESTAURANT_ID_FAIL:
        case actionTypes.DELETE_MENU_ITEM_FAIL:
        case actionTypes.SEARCH_MENU_ITEM_FAIL:
        case actionTypes.UPDATE_MENU_ITEMS_AVAILABILITY_FAIL:
        case actionTypes.UPDATE_MENU_ITEMS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload, // Store error message
                message: null
            };

        // DEFAULT CASE (Return Current State)
        default:
            return state;
    }
};

export default menuItemReducer;
