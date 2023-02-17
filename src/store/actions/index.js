import { AUTH_LOGIN } from "./types/actionTypes";


export const authLogin = (state) => {
    return (dispatch) => {
        dispatch({ type: AUTH_LOGIN });
        console.log("This is coming from Redux: ", state.authReducer);
    };
};
