import * as actionTypes from './ActionType';

const initialState = {
    reviews: [],          // List of reviews for a restaurant
    orderReview: null,    // Review for specific order
    averageRating: 0,     // Average rating of a restaurant
    loading: false,       // Loading state
    error: null,          // Error messages
    message: null         // Success/Info messages
};

const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        // Request cases
        case actionTypes.CREATE_REVIEW_REQUEST:
        case actionTypes.GET_RESTAURANT_REVIEWS_REQUEST:
        case actionTypes.GET_AVERAGE_RATING_REQUEST:
        case actionTypes.UPDATE_REVIEW_REQUEST:
        case actionTypes.DELETE_REVIEW_REQUEST:
        case actionTypes.GET_ORDER_REVIEW_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                message: null
            };

        // Success cases
        case actionTypes.CREATE_REVIEW_SUCCESS:
            return {
                ...state,
                loading: false,
                reviews: [...state.reviews, action.payload],
                message: "Review submitted successfully!"
            };

        case actionTypes.GET_RESTAURANT_REVIEWS_SUCCESS:
            return {
                ...state,
                loading: false,
                reviews: action.payload
            };

        case actionTypes.GET_AVERAGE_RATING_SUCCESS:
            return {
                ...state,
                loading: false,
                averageRating: action.payload
            };

        case actionTypes.UPDATE_REVIEW_SUCCESS:
            return {
                ...state,
                loading: false,
                reviews: state.reviews.map(review =>
                    review.id === action.payload.id ? action.payload : review
                ),
                message: "Review updated successfully!"
            };

        case actionTypes.DELETE_REVIEW_SUCCESS:
            return {
                ...state,
                loading: false,
                reviews: state.reviews.filter(review => review.id !== action.payload),
                message: "Review deleted successfully!"
            };


        case actionTypes.GET_ORDER_REVIEW_SUCCESS:
            return {
                ...state,
                loading: false,
                orderReview: action.payload
            };

        // Failure cases
        case actionTypes.CREATE_REVIEW_FAIL:
        case actionTypes.GET_RESTAURANT_REVIEWS_FAIL:
        case actionTypes.GET_AVERAGE_RATING_FAIL:
        case actionTypes.UPDATE_REVIEW_FAIL:
        case actionTypes.DELETE_REVIEW_FAIL:
        case actionTypes.GET_ORDER_REVIEW_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
                message: null
            };

        default:
            return state;
    }
};

export default reviewReducer;