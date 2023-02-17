// import { SET_CONNECTED, SET_ERROR, SET_IS_CALLER, SET_MESSAGES, SET_MESSAGE_INPUT, SET_WEBSOCKET } from "../actions/types/actionTypes";

import { SET_CONNECTED, SET_ERROR, SET_MESSAGES, SET_WEBSOCKET } from "../actions/types/actionTypes";


// const initialState = {
//     connected: false,
//     isCaller: false,
//     messages: [],
//     messageInput: '',
//     websocket: null,
//     error: null,
// };

// export const webSocketReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case SET_CONNECTED:
//             return {
//                 ...state,
//                 connected: action.payload,
//             };

//         case SET_IS_CALLER:
//             return {
//                 ...state,
//                 isCaller: action.payload,
//             };

//         case SET_MESSAGES:
//             return {
//                 ...state,
//                 messages: action.payload,
//             };

//         case SET_MESSAGE_INPUT:
//             return {
//                 ...state,
//                 messageInput: action.payload,
//             };

//         case SET_WEBSOCKET:
//             return {
//                 ...state,
//                 websocket: action.payload,
//             };

//         case SET_ERROR:
//             return {
//                 ...state,
//                 error: action.payload,
//             };

//         default:
//             return state;
//     }
// };
const initialState = {
    connected: false,
    messages: [],
    websocket: null,
    error: null,
};

export const webSocketReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CONNECTED:
            return {
                ...state,
                connected: action.payload,
            };

        case SET_MESSAGES:
            return {
                ...state,
                messages: action.payload,
            };

        case SET_WEBSOCKET:
            return {
                ...state,
                websocket: action.payload,
            };

        case SET_ERROR:
            return {
                ...state,
                error: action.payload,
            };

        default:
            return state;
    }
};
