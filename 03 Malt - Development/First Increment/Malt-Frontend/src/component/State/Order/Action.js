
import { api } from "../../config/api"
import { CREATE_ORDER_FAIL, CREATE_ORDER_REQUEST, CREATE_ORDER_SUCCESS, GET_USER_ORDER_FAIL, GET_USER_ORDER_REQUEST, GET_USER_ORDER_SUCCESS } from "./ActionType"


export const createRestaurant = (reqData) => {
    return async (dispatch) => {
        dispatch({ type: CREATE_ORDER_REQUEST })
        try {
            const { data } = await api.post(`/api/order`, reqData.order, {
                headers: {
                    Authorization: `Bearer ${reqData.jwt}`
                }
            })

            dispatch({ type: CREATE_ORDER_SUCCESS, payload: data })
            console.log("Created Order", data)

        } catch (error) {
            dispatch({ type: CREATE_ORDER_FAIL, payload: error })
            console.log("error", error)
        }
    }
}

// User Order History
export const getUserOrders = (jwt) => {
    return async (dispatch) => {
        dispatch({ type: GET_USER_ORDER_REQUEST })
        try {
            const { data } = await api.get(`/api/order/user`, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })

            dispatch({ type: GET_USER_ORDER_SUCCESS, payload: data })
            console.log("Get User Order", data)

        } catch (error) {
            dispatch({ type: GET_USER_ORDER_FAIL, payload: error })
            console.log("error", error)
        }
    }
}