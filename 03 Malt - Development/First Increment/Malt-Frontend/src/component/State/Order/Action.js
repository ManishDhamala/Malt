
import { api } from "../../config/api"
import { CREATE_ORDER_FAIL, CREATE_ORDER_REQUEST, CREATE_ORDER_SUCCESS, GET_USER_ORDER_FAIL, GET_USER_ORDER_REQUEST, GET_USER_ORDER_SUCCESS } from "./ActionType"


// export const createOrder = (reqData) => {
//     return async (dispatch) => {
//         dispatch({ type: CREATE_ORDER_REQUEST })
//         try {
//             const { data } = await api.post(`/api/order`, reqData.order, {
//                 headers: {
//                     Authorization: `Bearer ${reqData.jwt}`
//                 }
//             });

//             // Only redirect if there's a payment_url (i.e., online payment)
//             if (data.paymentUrl) {
//                 window.location.href = data.paymentUrl;
//             } else {
//                 // COD: Redirect manually to success page (optional)
//                 window.location.href = "/payment/success/" + data.id;
//             }

//             dispatch({ type: CREATE_ORDER_SUCCESS, payload: data })
//             console.log("Created Order", data)

//         } catch (error) {
//             dispatch({ type: CREATE_ORDER_FAIL, payload: error })
//             console.log("error", error)
//         }
//     }
// }


export const createOrder = (reqData) => {
    return async (dispatch) => {
        dispatch({ type: CREATE_ORDER_REQUEST });

        try {
            const { data } = await api.post(`/api/order`, reqData.order, {
                headers: {
                    Authorization: `Bearer ${reqData.jwt}`,
                },
            });

            dispatch({ type: CREATE_ORDER_SUCCESS, payload: data });
            return data; // Return to handle in component

        } catch (error) {
            dispatch({ type: CREATE_ORDER_FAIL, payload: error });
            throw error;
        }
    };
};





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