
import { api } from "../../config/api"
import { ADD_ITEM_TO_CART_FAIL, ADD_ITEM_TO_CART_REQUEST, ADD_ITEM_TO_CART_SUCCESS, CLEAR_CART_FAIL, CLEAR_CART_REQUEST, CLEAR_CART_SUCCESS, FIND_CART_FAIL, FIND_CART_REQUEST, FIND_CART_SUCCESS, GET_ALL_CART_ITEM_FAIL, GET_ALL_CART_ITEM_REQUEST, GET_ALL_CART_ITEM_SUCCESS, REMOVE_CART_ITEM_FAIL, REMOVE_CART_ITEM_REQUEST, REMOVE_CART_ITEM_SUCCESS, UPDATE_CART_ITEM_FAIL, UPDATE_CART_ITEM_REQUEST, UPDATE_CART_ITEM_SUCCESS } from "./ActionType"


export const findCart = (jwt) => {
    return async (dispatch) => {
        dispatch({ type: FIND_CART_REQUEST })
        try {
            const response = await api.get(`/api/cart`, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })

            dispatch({ type: FIND_CART_SUCCESS, payload: response.data })
            console.log("My Cart", response.data)

        } catch (error) {
            dispatch({ type: FIND_CART_FAIL, payload: error })
            console.log("error", error)
        }
    }
}


// No endpoint in the backend
export const getAllCartItems = (reqData) => {
    return async (dispatch) => {
        dispatch({ type: GET_ALL_CART_ITEM_REQUEST })
        try {
            const response = await api.get(`/api/cart/${reqData.cartId}/items`, {
                headers: {
                    Authorization: `Bearer ${reqData.jwt}`
                }
            })

            dispatch({ type: GET_ALL_CART_ITEM_SUCCESS, payload: response.data })
            console.log("All Cart Items", response.data)

        } catch (error) {
            dispatch({ type: GET_ALL_CART_ITEM_FAIL, payload: error })
            console.log("error", error)
        }
    }
}


// export const addItemToCart = (reqData) => {
//     return async (dispatch) => {
//         dispatch({ type: ADD_ITEM_TO_CART_REQUEST })
//         try {
//             const { data } = await api.put(`/api/cart/add`, reqData.cartItem,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${reqData.jwt}`
//                     }
//                 })

//             dispatch({ type: ADD_ITEM_TO_CART_SUCCESS, payload: data })
//             console.log("Add Item to Cart", data)

//         } catch (error) {
//             dispatch({ type: ADD_ITEM_TO_CART_FAIL, payload: error })
//             console.log("error", error)
//         }
//     }
// }


export const addItemToCart = (reqData) => {
    return async (dispatch, getState) => {
        dispatch({ type: ADD_ITEM_TO_CART_REQUEST })
        try {
            const { data } = await api.put(`/api/cart/add`, reqData.cartItem,
                {
                    headers: {
                        Authorization: `Bearer ${reqData.jwt}`
                    }
                })

            dispatch({ type: ADD_ITEM_TO_CART_SUCCESS, payload: data })
            console.log("Add Item to Cart", data)

        } catch (error) {
            dispatch({ type: ADD_ITEM_TO_CART_FAIL, payload: error })
            console.log("error", error)
        }
    }
}


export const updateCartItem = (reqData) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_CART_ITEM_REQUEST })
        try {
            const { data } = await api.put(`/api/cart-item/update`, reqData.data,
                {
                    headers: {
                        Authorization: `Bearer ${reqData.jwt}`
                    }
                })

            dispatch({ type: UPDATE_CART_ITEM_SUCCESS, payload: data })
            console.log("Update Cart Item", data)

        } catch (error) {
            dispatch({ type: UPDATE_CART_ITEM_FAIL, payload: error.message })
            console.log("error", error)
        }
    }
}


export const removeCartItem = ({ cartItemId, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: REMOVE_CART_ITEM_REQUEST })
        try {
            const { data } = await api.delete(`/api/cart-item/${cartItemId}/remove`, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })

            dispatch({ type: REMOVE_CART_ITEM_SUCCESS, payload: cartItemId })
            console.log("Remove Cart Item", data)

        } catch (error) {
            dispatch({ type: REMOVE_CART_ITEM_FAIL, payload: error.message })
            console.log("error", error)
        }
    }
}


export const clearCart = () => {
    return async (dispatch) => {
        dispatch({ type: CLEAR_CART_REQUEST })
        try {
            const { data } = await api.put(`/api/cart/clear`, {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwt")}`
                    }
                })

            dispatch({ type: CLEAR_CART_SUCCESS, payload: data })
            console.log("Clear Cart", data)

        } catch (error) {
            dispatch({ type: CLEAR_CART_FAIL, payload: error.message })
            console.log("error", error)
        }
    }
}


