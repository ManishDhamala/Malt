import { api } from "../../config/api"
import {
    CREATE_CATEGORY_FAIL,
    CREATE_CATEGORY_REQUEST,
    CREATE_CATEGORY_SUCCESS, CREATE_EVENT_FAIL, CREATE_EVENT_REQUEST, CREATE_EVENT_SUCCESS, CREATE_RESTAURANT_FAIL, CREATE_RESTAURANT_REQUEST, CREATE_RESTAURANT_SUCCESS, DELETE_CATEGORY_FAIL, DELETE_CATEGORY_REQUEST, DELETE_CATEGORY_SUCCESS, DELETE_RESTAURANT_FAIL, DELETE_RESTAURANT_REQUEST, DELETE_RESTAURANT_SUCCESS, GET_ALL_RESTAURANT_FAIL, GET_ALL_RESTAURANT_REQUEST, GET_ALL_RESTAURANT_SUCCESS, GET_RESTAURANT_BY_ID_FAIL, GET_RESTAURANT_BY_ID_REQUEST, GET_RESTAURANT_BY_ID_SUCCESS, GET_RESTAURANT_BY_USER_ID_FAIL, GET_RESTAURANT_BY_USER_ID_REQUEST, GET_RESTAURANT_BY_USER_ID_SUCCESS, GET_RESTAURANT_CATEGORY_FAIL, GET_RESTAURANT_CATEGORY_REQUEST, GET_RESTAURANT_CATEGORY_SUCCESS, SEARCH_RESTAURANT_FAIL, SEARCH_RESTAURANT_REQUEST, SEARCH_RESTAURANT_SUCCESS, UPDATE_RESTAURANT_FAIL, UPDATE_RESTAURANT_REQUEST, UPDATE_RESTAURANT_STATUS_FAIL, UPDATE_RESTAURANT_STATUS_REQUEST, UPDATE_RESTAURANT_STATUS_SUCCESS, UPDATE_RESTAURANT_SUCCESS
} from "./ActionType"


// export const getAllRestaurantsAction = (jwt) => {
//     return async (dispatch) => {
//         dispatch({ type: GET_ALL_RESTAURANT_REQUEST })
//         try {
//             const { data } = await api.get(`/api/restaurants`, {
//                 headers: {
//                     Authorization: `Bearer ${jwt}`
//                 }
//             })

//             dispatch({ type: GET_ALL_RESTAURANT_SUCCESS, payload: data })
//             console.log("All restaurant", data)

//         } catch (error) {
//             dispatch({ type: GET_ALL_RESTAURANT_FAIL, payload: error })
//             console.log("error", error)
//         }
//     }
// }


export const getAllRestaurantsAction = () => {
    return async (dispatch) => {
        dispatch({ type: GET_ALL_RESTAURANT_REQUEST })
        try {
            const { data } = await api.get(`/api/restaurants`)  // No JWT token required

            dispatch({ type: GET_ALL_RESTAURANT_SUCCESS, payload: data })
            console.log("All restaurant", data)

        } catch (error) {
            dispatch({ type: GET_ALL_RESTAURANT_FAIL, payload: error })
            console.log("error", error)
        }
    }
}


// export const getRestaurantById = (reqData) => {
//     return async (dispatch) => {
//         dispatch({ type: GET_RESTAURANT_BY_ID_REQUEST })
//         try {
//             const response = await api.get(`/api/restaurants/${reqData.restaurantId}`, {
//                 headers: {
//                     Authorization: `Bearer ${reqData.jwt}`
//                 }
//             })

//             dispatch({ type: GET_RESTAURANT_BY_ID_SUCCESS, payload: response.data })
//             console.log("Get Restaurant By Id", response.data)

//         } catch (error) {
//             dispatch({ type: GET_RESTAURANT_BY_ID_FAIL, payload: error })
//             console.log("error", error)
//         }
//     }
// }

export const getRestaurantById = (reqData) => {
    return async (dispatch) => {
        dispatch({ type: GET_RESTAURANT_BY_ID_REQUEST })
        try {
            const response = await api.get(`/api/restaurants/${reqData.restaurantId}`)

            dispatch({ type: GET_RESTAURANT_BY_ID_SUCCESS, payload: response.data })
            console.log("Get Restaurant By Id", response.data)

        } catch (error) {
            dispatch({ type: GET_RESTAURANT_BY_ID_FAIL, payload: error })
            console.log("error", error)
        }
    }
}


export const searchRestaurant = (reqData) => {
    return async (dispatch) => {
        dispatch({ type: SEARCH_RESTAURANT_REQUEST });
        try {
            const response = await api.get(`/api/restaurants/search`, {
                params: { keyword: reqData.keyword } //  Correctly passing as query param
            });

            dispatch({ type: SEARCH_RESTAURANT_SUCCESS, payload: response.data });
            console.log("Searched Restaurant: ", response.data);
        } catch (error) {
            dispatch({ type: SEARCH_RESTAURANT_FAIL, payload: error });
            console.log("error", error.response?.data || error.message);
        }
    };
};




export const getRestaurantByUserId = (jwt) => {
    return async (dispatch) => {
        dispatch({ type: GET_RESTAURANT_BY_USER_ID_REQUEST })
        try {
            const { data } = await api.get(`/api/admin/restaurants/user`, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })

            dispatch({ type: GET_RESTAURANT_BY_USER_ID_SUCCESS, payload: data })
            console.log("Get Restaurant By User Id", data)

        } catch (error) {
            dispatch({ type: GET_RESTAURANT_BY_USER_ID_FAIL, payload: error })
            console.log("error", error)
        }
    }
}


export const createRestaurant = (reqData) => {
    return async (dispatch) => {
        dispatch({ type: CREATE_RESTAURANT_REQUEST })
        try {
            const { data } = await api.post(`/api/admin/restaurants`, reqData.data, {
                headers: {
                    Authorization: `Bearer ${reqData.jwt}`
                }
            })

            dispatch({ type: CREATE_RESTAURANT_SUCCESS, payload: data })
            console.log("Created Restaurant", data)

        } catch (error) {
            dispatch({ type: CREATE_RESTAURANT_FAIL, payload: error })
            console.log("error", error)
        }
    }
}


export const updateRestaurant = ({ restaurantId, restaurantData, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_RESTAURANT_REQUEST })
        try {
            const response = await api.put(`/api/admin/restaurant/${restaurantId}`,
                restaurantData, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })

            dispatch({ type: UPDATE_RESTAURANT_SUCCESS, payload: response.data })
            console.log("Update Restaurant By Id", response.data)

        } catch (error) {
            dispatch({ type: UPDATE_RESTAURANT_FAIL, payload: error })
            console.log("error", error)
        }
    }
}


export const deleteRestaurant = ({ restaurantId, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: DELETE_RESTAURANT_REQUEST })
        try {
            const response = await api.delete(`/api/admin/restaurant/${restaurantId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })

            dispatch({ type: DELETE_RESTAURANT_SUCCESS, payload: restaurantId })
            console.log("Deleted Restaurant", response.data)

        } catch (error) {
            dispatch({ type: DELETE_RESTAURANT_FAIL, payload: error })
            console.log("error", error)
        }
    }
}


export const updateRestaurantStatus = ({ restaurantId, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_RESTAURANT_STATUS_REQUEST })
        try {
            const response = await api.put(`/api/admin/restaurants/${restaurantId}/status`,
                {}, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })

            dispatch({ type: UPDATE_RESTAURANT_STATUS_SUCCESS, payload: response.data })
            console.log("Update Restaurant Status", response.data)

        } catch (error) {
            dispatch({ type: UPDATE_RESTAURANT_STATUS_FAIL, payload: error })
            console.log("error", error)
        }
    }
}


// This api needs to be configure
// export const createEvent = ({ restaurantId, data, jwt }) => {
//     return async (dispatch) => {
//         dispatch({ type: CREATE_EVENT_REQUEST })
//         try {
//             const response = await api.post(`/api/admin/events/restaurant/${restaurantId}`,
//                 data, {
//                 headers: {
//                     Authorization: `Bearer ${jwt}`
//                 }
//             })

//             dispatch({ type: CREATE_EVENT_SUCCESS, payload: response.data })
//             console.log("Created Restaurant Event", response.data)

//         } catch (error) {
//             dispatch({ type: CREATE_EVENT_FAIL, payload: error })
//             console.log("error", error)
//         }
//     }
// }


export const createCategory = ({ reqData, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: CREATE_CATEGORY_REQUEST })
        try {
            const response = await api.post(`/api/admin/category`, reqData, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })

            dispatch({ type: CREATE_CATEGORY_SUCCESS, payload: response.data })
            console.log("Created Category", response.data)

        } catch (error) {
            dispatch({ type: CREATE_CATEGORY_FAIL, payload: error })
            console.log("error", error)
        }
    }
}


// export const getRestaurantCategory = ({ jwt, restaurantId }) => {
//     return async (dispatch) => {
//         dispatch({ type: GET_RESTAURANT_CATEGORY_REQUEST })
//         try {
//             const response = await api.get(`/api/category/restaurant/${restaurantId}`, {
//                 headers: {
//                     Authorization: `Bearer ${jwt}`
//                 }
//             })

//             dispatch({ type: GET_RESTAURANT_CATEGORY_SUCCESS, payload: response.data })
//             console.log("Get Restaurant Category", response.data)

//         } catch (error) {
//             dispatch({ type: GET_RESTAURANT_CATEGORY_FAIL, payload: error })
//             console.log("error", error)
//         }
//     }
// }


export const getRestaurantCategory = ({ restaurantId }) => {
    return async (dispatch) => {
        dispatch({ type: GET_RESTAURANT_CATEGORY_REQUEST })
        try {
            const response = await api.get(`/api/category/restaurant/${restaurantId}`)

            dispatch({ type: GET_RESTAURANT_CATEGORY_SUCCESS, payload: response.data })
            console.log("Get Restaurant Category", response.data)

        } catch (error) {
            dispatch({ type: GET_RESTAURANT_CATEGORY_FAIL, payload: error })
            console.log("error", error)
        }
    }
}


export const deleteFoodCategory = ({ categoryId, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: DELETE_CATEGORY_REQUEST })
        try {
            const { data } = await api.delete(`/api/admin/category/${categoryId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })

            dispatch({ type: DELETE_CATEGORY_SUCCESS, payload: categoryId })
            console.log("Deleted Food Category", data)

        } catch (error) {
            dispatch({ type: DELETE_CATEGORY_FAIL, payload: error })
            console.log("error", error)
        }
    }
}






