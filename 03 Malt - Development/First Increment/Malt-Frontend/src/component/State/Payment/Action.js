import { api } from "../../config/api"
import { GET_PAYMENT_HISTORY_FAIL, GET_PAYMENT_HISTORY_REQUEST, GET_PAYMENT_HISTORY_SUCCESS } from "./ActionTYpe"




export const getUserPaymentHistory = (jwt) => {
    return async (dispatch) => {
        dispatch({ type: GET_PAYMENT_HISTORY_REQUEST })
        try {
            const { data } = await api.get(`/api/payments/history`, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })

            dispatch({ type: GET_PAYMENT_HISTORY_SUCCESS, payload: data })
            console.log("Payment History", data)

        } catch (error) {
            dispatch({ type: GET_PAYMENT_HISTORY_FAIL, payload: error })
            console.log("error", error)
        }
    }
}