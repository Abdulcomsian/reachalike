import React, { useState, useEffect } from 'react'
import ReconnectingWebSocket from 'reconnecting-websocket'

const ChatRoom = () => {
    const [connectedText, setConnectedText] = useState(false)
    const [websocketConnectionClosedIdx, setWebsocketConnectionClosedIdx] = useState(0)
    const [websocketConnectionErrorIdx, setWebsocketConnectionErrorIdx] = useState(0)
    const [messages, setMessages] = useState([])

    useEffect(() => {
        const backendAddr = 'websocket-dev.bayes-chat.com'
        const numClosedWebsocketForWarning = 5
        const numErrorsWebsocketForWarning = 5
        const optionsWebsocket = {
            debug: true,
            automaticOpen: true,
            reconnectInterval: 5000,
            maxReconnectInterval: 60000,
            reconnectDecay: 2,
            timeoutInterval: 5000,
            maxReconnectAttempts: 6
        }

        const wsServerConnection = new ReconnectingWebSocket(`wss://${backendAddr}/ws`, null, optionsWebsocket)

        wsServerConnection.onclose = (e) => {
            setWebsocketConnectionClosedIdx(websocketConnectionClosedIdx + 1)
            console.warn('Connection closed with websocket')
            if (websocketConnectionClosedIdx % numClosedWebsocketForWarning === 0) {
                alert("1st Your internet connection seems to be unstable. The service has trouble connecting the server.")
            }
        }

        wsServerConnection.onerror = (e) => {
            console.warn('Connection error with websocket')
            setWebsocketConnectionErrorIdx(websocketConnectionErrorIdx + 1)
            if (websocketConnectionErrorIdx % numErrorsWebsocketForWarning === 0) {
                alert("2nd Your internet connection seems to be unstable. The service has trouble connecting the server.")
            }
        }
        wsServerConnection.onopen = function onOpenWebSocket(event) {
            event.preventDefault()
            console.log("Websocket connected")

            wsServerConnection.onmessage = async function (event) {
                event.preventDefault()
                let message = JSON.parse(event.data)
                console.log('Message from backend: ' + JSON.stringify(message))
                switch (message.type) {
                    case 'msg':
                        if (connectedText) {
                            setMessages([...messages, "Stranger: " + message.ct])
                        }
                        break

                    case 'cmd':
                        switch (message.ct) {
                            case 'connect_a':
                                // openConnectionAudio(isCaller)
                                break

                            case 'connect_t':
                                openConnectionText()
                                break

                            case 'disconnect':
                                closeConnection()
                                break

                            default:
                                console.log('DEFAULT CASE REACHED IN CMD MESSAGE FROM SERVER');
                                break;
                        }
                        break;
                }
            };
        };

        const closeConnection = () => {
            console.log("Connection closed")
            setConnectedText(false);
        };

        const openConnectionText = () => {
            setConnectedText(true);
        };

        return () => {
            wsServerConnection.close();
        };

    }, []);


    return (
        <div>
            <h1>Chat Room</h1>
            {messages.map((message, index) => (
                <p className='text-danger' key={index}>{message}</p>
            ))}
            {/* <button onClick={closeConnection} className="btn btn-danger">Close Connection</button> */}
        </div>
    );
};

export default ChatRoom;

