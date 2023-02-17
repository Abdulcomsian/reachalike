import { SET_CONNECTED, SET_ERROR, SET_MESSAGES, SET_WEBSOCKET } from "./types/actionTypes";

export const setConnected = (connected) => {
    console.log("Connected Object: ", connected)
    return {
        type: SET_CONNECTED,
        payload: connected,
    };
};

export const setWebSocket = (websocket) => {
    console.log("Set Web Socket: ", websocket)
    return {
        type: SET_WEBSOCKET,
        payload: websocket,
    };
};

export const setError = (error) => {
    return {
        type: SET_ERROR,
        payload: error,
    };
};

export const setMessage = (message) => {
    return {
        type: SET_MESSAGES,
        payload: message,
    };
};

// import ReconnectingWebSocket from "reconnecting-websocket";
// import { SOCKET_API } from "../../utils/constants";
// import { SET_CONNECTED, SET_ERROR, SET_IS_CALLER, SET_MESSAGES, SET_MESSAGE_INPUT, SET_WEBSOCKET } from "./types/actionTypes";



// const optionsWebsocket = {
//     debug: true,
//     automaticOpen: true,
//     reconnectInterval: 5000,
//     maxReconnectInterval: 60000,
//     reconnectDecay: 2,
//     timeoutInterval: 5000,
//     maxReconnectAttempts: 6
// }

// // Actions
// export const setConnected = (connected) => {
//     const webSocket = new ReconnectingWebSocket(`ws://${SOCKET_API}`, [], optionsWebsocket);
//     return {
//         type: SET_CONNECTED,
//         payload: connected,
//     };
// };

// export const connectWebSocket = () => {
//     return (dispatch) => {
//         const websocket = new ReconnectingWebSocket(`ws://${SOCKET_API}`, [], optionsWebsocket);
//         dispatch(setConnected(websocket));
//     };
// }

// export const setIsCaller = (isCaller) => {
//     return {
//         type: SET_IS_CALLER,
//         payload: isCaller,
//     };
// };

// export const setMessages = (messages) => {
//     return {
//         type: SET_MESSAGES,
//         payload: messages,
//     };
// };

// export const setMessageInput = (messageInput) => {
//     return {
//         type: SET_MESSAGE_INPUT,
//         payload: messageInput,
//     };
// };

// export const setWebsocket = (websocket) => {
//     return {
//         type: SET_WEBSOCKET,
//         payload: websocket,
//     };
// };

// export const setError = (error) => {
//     return {
//         type: SET_ERROR,
//         payload: error,
//     };
// };