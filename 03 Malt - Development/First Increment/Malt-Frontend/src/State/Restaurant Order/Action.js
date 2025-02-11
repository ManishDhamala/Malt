import { api } from "../../component/config/api"
import { GET_RESTAURANT_ORDER_FAIL, GET_RESTAURANT_ORDER_REQUEST, GET_RESTAURANT_ORDER_SUCCESS, UPDATE_ORDER_STATUS_FAIL, UPDATE_ORDER_STATUS_REQUEST, UPDATE_ORDER_STATUS_SUCCESS } from "./ActionType"



export const updateOrderStatus = ({ orderId, orderStatus, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_ORDER_STATUS_REQUEST })
        try {
            const response = await api.put(`/api/admin/order/${orderId}/${orderStatus}`,
                {}, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })

            dispatch({ type: UPDATE_ORDER_STATUS_SUCCESS, payload: response.data })
            console.log("Update Order Status", response.data)

        } catch (error) {
            dispatch({ type: UPDATE_ORDER_STATUS_FAIL, payload: error })
            console.log("error", error)
        }
    }
}


export const getRestaurantOrders = ({ restaurantId, orderStatus, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: GET_RESTAURANT_ORDER_REQUEST })
        try {
            const { data } = await api.get(`/api/admin/order/restaurant/${restaurantId}`, {
                params: { order_status: orderStatus },
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })

            dispatch({ type: GET_RESTAURANT_ORDER_SUCCESS, payload: data })
            console.log("Get Restaurant Orders", data)

        } catch (error) {
            dispatch({ type: GET_RESTAURANT_ORDER_FAIL, payload: error })
            console.log("error", error)
        }
    }
}