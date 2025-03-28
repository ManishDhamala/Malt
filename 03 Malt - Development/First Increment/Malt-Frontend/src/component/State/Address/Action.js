import { api } from "../../config/api";
import { GET_SAVED_ADDRESSES_FAIL, GET_SAVED_ADDRESSES_REQUEST, GET_SAVED_ADDRESSES_SUCCESS } from "./ActionType";


export const getSavedAddresses = (jwt) => async (dispatch) => {
    dispatch({ type: GET_SAVED_ADDRESSES_REQUEST });
    try {
        const { data } = await api.get("/api/users/saved-addresses", {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        dispatch({ type: GET_SAVED_ADDRESSES_SUCCESS, payload: data });
        console.log("Saved Address: ", data)
    } catch (error) {
        dispatch({ type: GET_SAVED_ADDRESSES_FAIL, payload: error });
        console.error("Error fetching saved addresses:", error);
    }
};
