import { GET_PAYMENT_HISTORY_FAIL, GET_PAYMENT_HISTORY_REQUEST, GET_PAYMENT_HISTORY_SUCCESS } from "./ActionTYpe";


const initialState = {
    loading: false,
    paymentHistory: [],
    error: null,
};

export const paymentHistoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PAYMENT_HISTORY_REQUEST:
            return { ...state, loading: true };
        case GET_PAYMENT_HISTORY_SUCCESS:
            return { loading: false, paymentHistory: action.payload, error: null };
        case GET_PAYMENT_HISTORY_FAIL:
            return { loading: false, paymentHistory: [], error: action.payload };
        default:
            return state;
    }
};
