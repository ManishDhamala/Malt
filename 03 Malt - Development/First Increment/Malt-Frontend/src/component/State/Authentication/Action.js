import axios from "axios"
import { ADD_TO_FAVORITE_FAIL, ADD_TO_FAVORITE_REQUEST, ADD_TO_FAVORITE_SUCCESS, GET_USER_FAIL, GET_USER_REQUEST, GET_USER_SUCCESS, LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, REGISTER_FAIL, REGISTER_REQUEST, REGISTER_SUCCESS } from "./ActionType"
import { api, API_URL } from "../../config/api"
import { RESET_RESTAURANT_STATE } from "../Restaurant/ActionType"


export const registerUser = (reqData) => async (dispatch) => {
    dispatch({ type: REGISTER_REQUEST })
    try {
        const { data } = await axios.post(`${API_URL}/auth/signup`, reqData.userData)
        if (data.jwt) localStorage.setItem("jwt", data.jwt);
        if (data.role === "ROLE_RESTAURANT_OWNER") {
            reqData.navigate("/admin/restaurant")
        } else {
            reqData.navigate("/")
        }
        dispatch({ type: REGISTER_SUCCESS, payload: data.jwt })
        console.log("Register Success", data)
        return { success: true, data };  //  RETURN RESPONSE HERE


    } catch (error) {
        dispatch({ type: REGISTER_FAIL, payload: error })
        console.log("error", error)
        return { error: error.response?.data?.message || "Email is already used" };  //  RETURN ERROR RESPONSE
    }
}


export const loginUser = (reqData) => async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST })
    try {
        const { data } = await axios.post(`${API_URL}/auth/signin`, reqData.userData)
        if (data.jwt) localStorage.setItem("jwt", data.jwt);
        if (data.role === "ROLE_RESTAURANT_OWNER") {
            reqData.navigate("/admin/restaurant")
        } else {
            reqData.navigate("/")
        }
        dispatch({ type: LOGIN_SUCCESS, payload: data.jwt })
        console.log("Login Success", data)

        return { success: true, data };  //  RETURN RESPONSE HERE


    } catch (error) {
        dispatch({ type: LOGIN_FAIL, payload: error })
        console.log("error", error)

        return { error: error.response?.data?.message || "Invalid Username or Password" };  //  RETURN ERROR RESPONSE
    }

}


export const getUser = (jwt) => async (dispatch) => {
    dispatch({ type: GET_USER_REQUEST })
    try {
        const { data } = await api.get(`/api/users/profile`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })

        dispatch({ type: GET_USER_SUCCESS, payload: data })
        console.log("User profile", data)

    } catch (error) {
        dispatch({ type: GET_USER_FAIL, payload: error })
        console.log("error", error)
    }
}


export const addToFavorite = ({ jwt, restaurantId }) => async (dispatch) => {
    dispatch({ type: ADD_TO_FAVORITE_REQUEST })
    try {
        const { data } = await api.put(`/api/restaurants/${restaurantId}/add-favourites`,
            {}, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })

        dispatch({ type: ADD_TO_FAVORITE_SUCCESS, payload: data })
        console.log("Added to Favorite", data)

    } catch (error) {
        dispatch({ type: ADD_TO_FAVORITE_FAIL, payload: error })
        console.log("error", error)
    }
}

export const logout = () => async (dispatch) => {
    try {
        localStorage.clear();
        dispatch({ type: LOGOUT })
        dispatch({ type: RESET_RESTAURANT_STATE }); // Clear previous user's restaurant data
        console.log("Logout Success")

    } catch (error) {
        console.log("error", error)
    }
}




