import { combineReducers } from "redux";
import authReducer from "./AuthReducer";
import { webSocketReducer } from "./WebSocketReducer";

const rootReducer = combineReducers({
    authReducer: authReducer,
    webSocketReducer: webSocketReducer
})

export default rootReducer