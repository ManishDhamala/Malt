import { GET_SAVED_ADDRESSES_FAIL, GET_SAVED_ADDRESSES_REQUEST, GET_SAVED_ADDRESSES_SUCCESS } from "./ActionType";


const initialState = {
    loading: false,
    savedAddresses: [],
    error: null,
};

export const addressReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SAVED_ADDRESSES_REQUEST:
            return { ...state, loading: true };

        case GET_SAVED_ADDRESSES_SUCCESS:
            return {
                ...state,
                loading: false,
                savedAddresses: action.payload,
                error: null,
            };

        case GET_SAVED_ADDRESSES_FAIL:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};
