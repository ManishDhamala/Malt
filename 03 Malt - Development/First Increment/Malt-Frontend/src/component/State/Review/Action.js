import { api } from "../../config/api";
import {
    CREATE_REVIEW_FAIL, CREATE_REVIEW_REQUEST, CREATE_REVIEW_SUCCESS,
    GET_RESTAURANT_REVIEWS_FAIL, GET_RESTAURANT_REVIEWS_REQUEST, GET_RESTAURANT_REVIEWS_SUCCESS,
    GET_AVERAGE_RATING_FAIL, GET_AVERAGE_RATING_REQUEST, GET_AVERAGE_RATING_SUCCESS,
    UPDATE_REVIEW_FAIL, UPDATE_REVIEW_REQUEST, UPDATE_REVIEW_SUCCESS,
    DELETE_REVIEW_FAIL, DELETE_REVIEW_REQUEST, DELETE_REVIEW_SUCCESS,
    GET_ORDER_REVIEW_REQUEST,
    GET_ORDER_REVIEW_SUCCESS,
    GET_ORDER_REVIEW_FAIL
} from "./ActionType";

// Create Review
export const createReview = ({ reviewData, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: CREATE_REVIEW_REQUEST });
        try {
            const { data } = await api.post("/api/reviews", reviewData, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });
            dispatch({ type: CREATE_REVIEW_SUCCESS, payload: data });
            console.log("New Review: ", data)
        } catch (error) {
            dispatch({ type: CREATE_REVIEW_FAIL, payload: error });
            console.log("Review Error: ", error.response.data?.message || error.response.data?.["message "])
            throw error;
        }
    };
};

// Get Restaurant Reviews
export const getRestaurantReviews = (restaurantId) => {
    return async (dispatch) => {
        dispatch({ type: GET_RESTAURANT_REVIEWS_REQUEST });
        try {
            const { data } = await api.get(`/api/reviews/restaurant/${restaurantId}`);
            dispatch({ type: GET_RESTAURANT_REVIEWS_SUCCESS, payload: data });
            console.log("Restaurant Review: ", data)
        } catch (error) {
            dispatch({ type: GET_RESTAURANT_REVIEWS_FAIL, payload: error });
            console.log("Review Error: ", error)
        }
    };
};

// Get Average Rating
export const getAverageRating = (restaurantId) => {
    return async (dispatch) => {
        dispatch({ type: GET_AVERAGE_RATING_REQUEST });
        try {
            const { data } = await api.get(`/api/reviews/restaurant/${restaurantId}/average-rating`);
            dispatch({ type: GET_AVERAGE_RATING_SUCCESS, payload: data });
            console.log("Restaurant Average Review Rating: ", data)
        } catch (error) {
            dispatch({ type: GET_AVERAGE_RATING_FAIL, payload: error });
            console.log("Review Error: ", error)
        }
    };
};



// Delete Review
export const deleteReview = ({ reviewId, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: DELETE_REVIEW_REQUEST });
        try {
            await api.delete(`/api/reviews/${reviewId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });
            dispatch({ type: DELETE_REVIEW_SUCCESS, payload: reviewId });
            console.log("Review Deleted")
        } catch (error) {
            dispatch({ type: DELETE_REVIEW_FAIL, payload: error });
            console.log("Review Error: ", error)
        }
    };
};


// Update Review
export const updateReview = ({ reviewId, reviewData, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_REVIEW_REQUEST });
        try {
            const { data } = await api.put(`/api/reviews/${reviewId}`, reviewData, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });
            dispatch({ type: UPDATE_REVIEW_SUCCESS, payload: data });
            console.log("Updated Review: ", data)
        } catch (error) {
            dispatch({ type: UPDATE_REVIEW_FAIL, payload: error });
            console.log("Review Error: ", error)
        }
    };
};


// Getting review on the basis of orderId and user ID
export const getReviewByOrderId = ({ orderId, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: GET_ORDER_REVIEW_REQUEST });
        try {
            const { data } = await api.get(`/api/reviews/order/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            dispatch({ type: GET_ORDER_REVIEW_SUCCESS, payload: data });
            console.log("Order Review", data);
            return data; // Explicitly return the API response data
        } catch (error) {
            dispatch({ type: GET_ORDER_REVIEW_FAIL, payload: error });
            console.log("Error fetching order review: ", error);
            throw error; // Rethrow the error to propagate it to the .catch block
        }
    };
};