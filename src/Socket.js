// This File contains the code that you provided as a reference of your previous website
// This file is not being used anywhere in the code
// It is just for the reference, so even if you remove it, nothing will go wrong

let backendAddr = 'websocket-dev.bayes-chat.com';

let websocketConnectionClosedIdx = 0;
const numClosedWebsocketForWarning = 5;
let websocketConnectionErrorIdx = 0;
const numErrorsWebsocketForWarning = 5;

let connectedText = false;

const optionsWebsocket = {
    debug: true,
    automaticOpen: true,
    reconnectInterval: 5000,
    maxReconnectInterval: 60000,
    reconnectDecay: 2,
    timeoutInterval: 5000,
    maxReconnectAttempts: 6
}
console.log("Ws create...");
wsServerConnection = new ReconnectingWebSocket('wss://' + backendAddr + `/ws`, null, optionsWebsocket); // change to wss here
wsServerConnection.onclose = (e) => {
    websocketConnectionClosedIdx += 1;
    console.warn('Connection closed with websocket');
    if (websocketConnectionClosedIdx % numClosedWebsocketForWarning == 0) {
        alert("Your internet connection seems to be unstable. The service has trouble connecting the server.")
    }
}
wsServerConnection.onerror = (e) => {
    console.warn('Connection error with websocket');
    websocketConnectionErrorIdx += 1;
    if (websocketConnectionErrorIdx % numErrorsWebsocketForWarning == 0) {
        alert("Your internet connection seems to be unstable. The service has trouble connecting the server.")
    }
}

//location.reload();

let messagesList = document.querySelector('#messages');
let canvasElement;
let waveElement;

let connectionButtonLarge = document.querySelector("#connection-button-large");
connectionButtonLarge.textContent = 'Waiting for server connection...';

wsServerConnection.onopen = function onOpenWebSocket(event) {
    event.preventDefault();
    console.log("Websocket connected");
    addConnectionButtonsTextAudio();

    wsServerConnection.onmessage = async function (event) {
        event.preventDefault();
        let message = JSON.parse(event.data);
        console.log('Message from backend: ' + JSON.stringify(message));
        switch (message.type) {
            case 'msg':
                if (connectedText) {
                    addMessageList("Stranger: " + message.ct);
                }
                break;

            case 'cmd':
                switch (message.ct) {
                    case 'connect_a':
                        isCaller = message.isCaller;
                        await openConnectionAudio(isCaller);
                        break;

                    case 'connect_t':
                        openConnectionText();
                        break;

                    case 'disconnect':
                        closeConnection();
                        break;

                    default:
                        console.log('DEFAULT CASE REACHED IN CMD MESSAGE FROM SERVER')
                        break;
                }
                break;

            case 'info':
                addMessageList(message.ct);
                break;

            default:
                console.warn('Message from server invalid: ' + JSON.stringify(message));
                break;
        }
    }

};

function sendConnectTextRequest(event) {
    console.log("Sending connection request to server...")
    let messageContent = {
        "type": "cmd",
        "ct": "connect_t"
    };
    wsServerConnection.send(JSON.stringify(messageContent));
    addDisconnectButton();
}

function sendDisconnectRequest() {
    console.log("Sending disconnect request to server...");
    let messageContent = {
        "type": "cmd",
        "ct": "disconnect"
    };
    wsServerConnection.send(JSON.stringify(messageContent));
    connectionButtonLarge.removeEventListener("click", sendDisconnectRequest);
}

function openConnectionText() {
    console.log('Text connection to stranger...');
    setupMessagesList();
    connectedText = true;
    addSendForm();
    addMessageList('You are connected to a new stranger. Say Hi !');
    connectionButtonLarge.textContent = 'Disconnect';
    connectionButtonLarge.addEventListener("click", sendDisconnectRequest);
}

function closeConnection() {
    console.log('Disconnect from stranger...');
    if (connectedText) {
        removeSendForm();
    }
    connectedText = false;
    addMessageList('You are now disconnected');
    addConnectionButtonsTextAudio();
}

function sendMessageServer(event) {
    if (connectedText) {
        console.log("Send message to connected user");
        let input = document.querySelector("#message-box");
        let messageContent = {
            "type": "msg",
            "ct": input.value
        };
        wsServerConnection.send(JSON.stringify(messageContent));
        addMessageList("You: " + input.value);
        input.value = '';
    }
    else {
        console.log("Cannot send message to connected user, not connected");
        addMessageList("You must connect first");
    }
    event.preventDefault();
};

function addDisconnectButton() {
    connectionButtonText = document.querySelector("#connection-button-text");
    connectionButtonText.remove();
    connectionButtonText = null;

    connectionButtonAudio = document.querySelector("#connection-button-audio");
    connectionButtonAudio.remove();
    connectionButtonAudio = null;

    connectionButtonLarge = document.createElement("button");
    connectionButtonLarge.setAttribute("id", "connection-button-large");
    connectionButtonLarge.textContent = 'Waiting for connection...';
    connectionButtonLarge.classList.add("connection-button");
    buttonsContainer.appendChild(connectionButtonLarge);
}

function addConnectionButtonsTextAudio() {
    connectionButtonLarge = document.querySelector("#connection-button-large");
    connectionButtonLarge.remove();
    connectionButtonLarge = null;

    let connectionButtonText = document.createElement("button");
    connectionButtonText.setAttribute("id", "connection-button-text");
    connectionButtonText.textContent = 'Connect Text';
    connectionButtonText.classList.add("connection-button");
    connectionButtonText.addEventListener("click", sendConnectTextRequest);

    let connectionButtonAudio = document.createElement("button");
    connectionButtonAudio.setAttribute("id", "connection-button-audio");
    connectionButtonAudio.textContent = 'Connect Audio';
    connectionButtonAudio.classList.add("connection-button");
    connectionButtonAudio.addEventListener("click", sendConnectAudioRequest);

    buttonsContainer.appendChild(connectionButtonText);
    buttonsContainer.appendChild(connectionButtonAudio);
}

function addMessageList(message) {
    if (messagesList) {
        let contentTextNode = document.createTextNode(message);
        let messageElement = document.createElement('li');
        messageElement.appendChild(contentTextNode);
        messagesList.appendChild(messageElement);
    } else {
        console.warn("Tried to add message to list " + message + " but messageList not created")
    }
}

function setupMessagesList() {
    if (canvasElement) {
        canvasElement.remove();
        canvasElement = null;
    }

    if (messagesList) {
        while (messagesList.firstChild) { messagesList.removeChild(messagesList.firstChild); }
    }
    else {
        messagesList = document.createElement("ul");
        messagesList.setAttribute("class", "messages-list");
        messagesList.setAttribute("id", "messages-list-0");
        contentContainer.appendChild(messagesList);
    }
}




