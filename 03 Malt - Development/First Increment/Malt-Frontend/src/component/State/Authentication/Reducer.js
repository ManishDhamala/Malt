import { isPresentInFavourites } from "../../config/logic";
import { ADD_TO_FAVORITE_FAIL, ADD_TO_FAVORITE_REQUEST, ADD_TO_FAVORITE_SUCCESS, GET_USER_FAIL, GET_USER_REQUEST, GET_USER_SUCCESS, LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, REGISTER_FAIL, REGISTER_REQUEST, REGISTER_SUCCESS, RESEND_VERIFICATION_FAIL, RESEND_VERIFICATION_REQUEST, RESEND_VERIFICATION_SUCCESS, UPDATE_USER_FAIL, UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS, VERIFICATION_FAIL, VERIFICATION_REQUEST, VERIFICATION_SUCCESS } from "./ActionType";

const initialState = {
    user: null,
    isLoading: false,
    error: null,
    jwt: null,
    favourites: [],
    success: null,
    verificationRequired: false,
    verificationStatus: null,
    resendStatus: null
}

export const authReducer = (state = initialState, action) => {

    switch (action.type) {
        case REGISTER_REQUEST:
        case LOGIN_REQUEST:
        case GET_USER_REQUEST:
        case ADD_TO_FAVORITE_REQUEST:
        case UPDATE_USER_REQUEST:
        case VERIFICATION_REQUEST:
        case RESEND_VERIFICATION_REQUEST:
            return { ...state, isLoading: true, error: null, success: null }

        case REGISTER_SUCCESS:
            localStorage.setItem("jwt", action.payload.jwt); // Store JWT in localStorage
            return {
                ...state,
                isLoading: false,
                jwt: action.payload.jwt,
                verificationRequired: action.payload.verificationRequired,
                success: "Register Success"
            };

        case LOGIN_SUCCESS:
            localStorage.setItem("jwt", action.payload); // Store JWT in localStorage
            return {
                ...state,
                isLoading: false,
                jwt: action.payload,
                success: "Login Success"
            };

        case VERIFICATION_SUCCESS:
            return {
                ...state,
                isLoading: false,
                verificationStatus: "success",
                success: "Email verified successfully"
            };

        case RESEND_VERIFICATION_SUCCESS:
            return {
                ...state,
                isLoading: false,
                resendStatus: "success",
                success: "Verification email resent successfully"
            };

        case GET_USER_SUCCESS:
        case UPDATE_USER_SUCCESS:
            localStorage.setItem("user", JSON.stringify(action.payload)); //  Store user data in localStorage
            return {
                ...state,
                isLoading: false,
                user: action.payload,
                favourites: action.payload.favourites || state.favourites,
                success: "User updated successfully",
            };

        case ADD_TO_FAVORITE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null,
                favourites: isPresentInFavourites(state.favourites, action.payload)
                    ? state.favourites.filter((item) => item.id !== action.payload.id)
                    : [action.payload, ...state.favourites]
            }

        case LOGOUT:
            localStorage.removeItem("jwt"); // Remove JWT on logout
            localStorage.removeItem("user");
            return initialState;

        case VERIFICATION_FAIL:
            return {
                ...state,
                isLoading: false,
                verificationStatus: "fail",
                error: action.payload
            };

        case RESEND_VERIFICATION_FAIL:
            return {
                ...state,
                isLoading: false,
                resendStatus: "fail",
                error: action.payload
            };

        case REGISTER_FAIL:
        case LOGIN_FAIL:
        case GET_USER_FAIL:
        case ADD_TO_FAVORITE_FAIL:
        case UPDATE_USER_FAIL:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
                success: null
            }

        default:
            return state;
    }
}