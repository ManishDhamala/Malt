import axios from "axios"
import { ADD_TO_FAVORITE_FAIL, ADD_TO_FAVORITE_REQUEST, ADD_TO_FAVORITE_SUCCESS, GET_USER_FAIL, GET_USER_REQUEST, GET_USER_SUCCESS, LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, REGISTER_FAIL, REGISTER_REQUEST, REGISTER_SUCCESS, RESEND_VERIFICATION_FAIL, RESEND_VERIFICATION_REQUEST, RESEND_VERIFICATION_SUCCESS, UPDATE_USER_FAIL, UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS, VERIFICATION_FAIL, VERIFICATION_REQUEST, VERIFICATION_SUCCESS } from "./ActionType"
import { api, API_URL } from "../../config/api"
import { RESET_RESTAURANT_STATE } from "../Restaurant/ActionType"
import { resetNotificationState } from "../Notification/Action"


// export const registerUser = (reqData) => async (dispatch) => {
//     dispatch({ type: REGISTER_REQUEST })
//     try {
//         const { data } = await axios.post(`${API_URL}/auth/signup`, reqData.userData)
//         if (data.jwt) localStorage.setItem("jwt", data.jwt);
//         if (data.role === "ROLE_RESTAURANT_OWNER") {
//             reqData.navigate("/admin/restaurant")
//         } else {
//             reqData.navigate("/")
//         }
//         dispatch({ type: REGISTER_SUCCESS, payload: data.jwt })
//         console.log("Register Success", data)
//         return { success: true, data };

//     } catch (error) {
//         let message = "Something went wrong. Please try again.";
//         if (error.response) {
//             // Server responded but with error
//             message = error.response.data?.message || "Email is already used";
//         } else if (error.request) {
//             // Request was made but no response (e.g server is down)
//             message = "Network error. Please check your connection or try again later.";
//         }
//         dispatch({ type: REGISTER_FAIL, payload: message });
//         console.log("Register Error:", message);

//         return { error: message };
//     }
// }


// Modified registerUser action to handle verification flow
export const registerUser = (reqData) => async (dispatch) => {
    dispatch({ type: REGISTER_REQUEST })
    try {
        const { data } = await axios.post(`${API_URL}/auth/signup`, reqData.userData)

        const verificationRequired = data.message?.includes("Please check your email");

        // Only store JWT if user is immediately verified
        if (data.jwt && !verificationRequired) {
            localStorage.setItem("jwt", data.jwt);
        }

        if (verificationRequired) {
            reqData.navigate("/account/verification-pending", {
                state: { email: reqData.userData.email }
            });
        } else {
            if (data.role === "ROLE_RESTAURANT_OWNER") {
                reqData.navigate("/admin/restaurant")
            } else {
                reqData.navigate("/")
            }
        }

        dispatch({
            type: REGISTER_SUCCESS,
            payload: {
                jwt: verificationRequired ? null : data.jwt,
                verificationRequired: verificationRequired
            }
        });

        return { success: true, data, verificationRequired };

    } catch (error) {
        let message = "Something went wrong. Please try again.";
        if (error.response) {
            // Server responded but with error
            message = error.response.data?.message || "Email is already used";
        } else if (error.request) {
            // Request was made but no response (e.g server is down)
            message = "Network error. Please check your connection or try again later.";
        }
        dispatch({ type: REGISTER_FAIL, payload: message });
        console.log("Register Error:", message);

        return { error: message };
    }
}


// Fix the frontend error handling - Modify your loginUser function
export const loginUser = (reqData) => async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST })
    try {
        const { data } = await axios.post(`${API_URL}/auth/signin`, reqData.userData)

        if (data.jwt) {
            localStorage.setItem("jwt", data.jwt);
            if (data.role === "ROLE_RESTAURANT_OWNER") {
                reqData.navigate("/admin/restaurant")
            } else {
                reqData.navigate("/")
            }
        }

        dispatch({ type: LOGIN_SUCCESS, payload: data.jwt })
        return { success: true, data };
    } catch (error) {
        let message = "Something went wrong. Please try again...";

        if (error.response) {
            // Get the error message from the response
            const errorMessage = error.response.data?.message || error.response.data?.["message "];

            // Handle email verification case separately
            if (errorMessage?.includes("EMAIL_NOT_VERIFIED") ||
                errorMessage?.includes("Email not verified")) {

                const email = reqData.userData.email;
                if (email) {
                    localStorage.setItem('pendingVerificationEmail', email);
                }
                reqData.navigate("/account/verification-pending");
                message = "Please verify your email before logging in.";
            }
            // Handle all other error cases
            else {
                message = errorMessage ||
                    (error.response.status === 401 ? "Invalid username or password" :
                        "Invalid username or password");
            }
        }

        dispatch({ type: LOGIN_FAIL, payload: message });
        return { error: message };
    }
}


// Verify email with token (when user clicks link in email)
export const verifyEmail = (token, navigate) => async (dispatch) => {
    dispatch({ type: VERIFICATION_REQUEST });

    try {
        const response = await axios.get(`${API_URL}/auth/verify?token=${token}`);

        dispatch({ type: VERIFICATION_SUCCESS });

        // Wait briefly for user to see success message before redirecting to login
        setTimeout(() => {
            navigate('/account/login');
        }, 3000);

        return { success: true };
    } catch (error) {
        let message = "Verification failed. Please try again.";
        if (error.response) {
            message = error.response.data || message;
        }

        dispatch({ type: VERIFICATION_FAIL, payload: message });
        return { error: message };
    }
};

// Resend verification email
export const resendVerification = (email) => async (dispatch) => {
    dispatch({ type: RESEND_VERIFICATION_REQUEST });

    try {
        const response = await axios.post(`${API_URL}/auth/resend-verification?email=${email}`);

        dispatch({ type: RESEND_VERIFICATION_SUCCESS });
        return { success: true };
    } catch (error) {
        let message = "Failed to resend verification email. Please try again.";
        if (error.response) {
            message = error.response.data || message;
        }

        dispatch({ type: RESEND_VERIFICATION_FAIL, payload: message });
        return { error: message };
    }
};




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


export const updateUser = ({ jwt, user }) => async (dispatch) => {
    dispatch({ type: UPDATE_USER_REQUEST })
    try {
        const { data } = await api.put(`/api/users/update`,
            user, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })

        dispatch({ type: UPDATE_USER_SUCCESS, payload: data })
        console.log("User Updated: ", data)

    } catch (error) {
        dispatch({ type: UPDATE_USER_FAIL, payload: error })
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
        dispatch(resetNotificationState()); // Reset notification state
        console.log("Logout Success")

    } catch (error) {
        console.log("error", error)
    }
}




