import { useState, useEffect, useRef } from "react";
import "./App.css";
import Header from "./layouts/header";
import MainScreen from "./pages/main";
import ChatScreen from "./pages/chat";
import AudioChat from "./pages/audio-chat";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import NearME from "./pages/near-me";
import TermCondition from "./pages/term-condition";
import Policy from "./pages/term-condition/index-policy";
import "./assets/css/media.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import ReconnectingWebSocket from "reconnecting-websocket";
import { Provider, useDispatch } from "react-redux";
import store from "./store";
import { authLogin as LoginAction } from "./store/actions";

const BackendAddr = 'websocket-dev.bayes-chat.com';
const NumClosedWebsocketForWarning = 5;
const NumErrorsWebsocketForWarning = 5;

const OptionsWebsocket = {
  debug: true,
  automaticOpen: true,
  reconnectInterval: 5000,
  maxReconnectInterval: 60000,
  reconnectDecay: 2,
  timeoutInterval: 5000,
  maxReconnectAttempts: 6,
};


function App() {
  const ref = useRef();
  const [user, setUser] = useState("");
  const [authLogin, setAuthLogin] = useState(false);
  const [authRegister, setAuthRegister] = useState(false);
  const [nearMe, setNearMe] = useState(false);

  const [findUser, setFindUser] = useState(false);
  const [endChat, setEndChat] = useState(false);


  const loginHandler = (e) => {
    setAuthLogin(!authLogin);
    if (authRegister) {
      setAuthRegister(false);
    } else if (nearMe) {
      setNearMe(false);
    }
  };
  const registerHandler = (e) => {
    setAuthRegister(!authRegister);
    if (authLogin) {
      setUser("admin");
      setAuthLogin(false);
    } else if (nearMe) {
      setNearMe(false);
    }
  };
  const nearMeHandler = (e) => {
    setNearMe(!nearMe);
    if (authLogin) {
      setAuthLogin(false);
    } else if (authRegister) {
      setAuthRegister(false);
    }
  };
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (authLogin && ref.current && !ref.current.contains(e.target)) {
        setAuthLogin(false);
        LoginAction()
      } else if (
        authRegister &&
        ref.current &&
        !ref.current.contains(e.target)
      ) {
        setAuthRegister(false);
      } else if (nearMe && ref.current && !ref.current.contains(e.target)) {
        setNearMe(false);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [authLogin, authRegister, nearMe]);


  // Chat API Integration
  const [ws, setWs] = useState(null);
  const [websocketConnectionClosedIdx, setWebsocketConnectionClosedIdx] = useState(0);
  const [websocketConnectionErrorIdx, setWebsocketConnectionErrorIdx] = useState(0);
  const [connectedText, setConnectedText] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isChatActive, setIsChatActive] = useState(false);
  const [isCaller, setIsCaller] = useState(false);


  useEffect(() => {
    const websocket = new ReconnectingWebSocket(`wss://${BackendAddr}/ws`, null, OptionsWebsocket);
    setWs(websocket);

    return () => {
      if (websocket) {
        websocket.close();
        setWs(null);
      }
    };
  }, []);

  useEffect(() => {
    if (ws) {
      ws.onopen = () => {
        console.log('Websocket connected');
      };

      ws.onmessage = async (event) => {
        let message = JSON.parse(event.data);
        console.log('Message from backend: ' + JSON.stringify(message));
        switch (message.type) {
          case 'msg':
            console.log('Received message: ' + message.ct);
            setMessages([...messages, message.ct])
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

          case 'error':
            addMessageList("Error: " + message.ct);
            break;

          default:
            console.warn('Message from server invalid: ' + JSON.stringify(message));
            break;
        }
      };

      ws.onclose = (event) => {
        setWebsocketConnectionClosedIdx(websocketConnectionClosedIdx + 1);
        console.warn('Connection closed with websocket');
        if (websocketConnectionClosedIdx % NumClosedWebsocketForWarning === 0) {
          alert('Your internet connection seems to be unstable. The service has trouble connecting the server.');
        }
      };

      ws.onerror = (event) => {
        console.warn('Connection error with websocket');
        setWebsocketConnectionErrorIdx(websocketConnectionErrorIdx + 1);
        if (websocketConnectionErrorIdx % NumErrorsWebsocketForWarning === 0) {
          alert('Your internet connection seems to be unstable. The service has trouble connecting the server.');
        }
      };
    }
  }, [ws, messages, isChatActive]);

  const sendConnectTextRequest = () => {
    console.log('Sending connection request to server...');
    let messageContent = {
      type: 'cmd',
      ct: 'connect_t',
    };
    ws.send(JSON.stringify(messageContent));
  };

  const sendDisconnectRequest = () => {
    console.log('Sending disconnect request to server...');
    let messageContent = {
      type: 'cmd',
      ct: 'disconnect',
    }
    ws.send(JSON.stringify(messageContent));
  }

  const openConnectionAudio = async (isCaller) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const peerConnection = new RTCPeerConnection();

      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          const messageContent = {
            type: 'audio-ice-candidate',
            candidate: event.candidate,
          };
          ws.send(JSON.stringify(messageContent));
        }
      };

      if (isCaller) {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        const messageContent = {
          type: 'audio-offer',
          offer: offer,
        };
        ws.send(JSON.stringify(messageContent));
      } else {
        // Wait for an offer from the caller
      }
    } catch (error) {
      console.error('Error while opening audio connection:', error);
    }
  }

  const addMessageList = (text) => {
    console.log('Adding message: ' + text);
    setMessages((messages) => [...messages, text]);
  };

  const sendMessage = (message) => {
    if (connectedText) {
      const messageContent = {
        type: 'msg',
        ct: message,
      };
      ws.send(JSON.stringify(messageContent));
      addMessageList("You: " + message);
    } else {
      console.warn('Cannot send message: not connected to another user');
    }
  };

  const connectToUser = () => {
    console.log('Sending connection request to server...');
    let messageContent = {
      type: 'cmd',
      ct: 'connect_t',
    };
    ws.send(JSON.stringify(messageContent));
  };

  const openConnectionText = () => {
    console.log('Text connection to stranger...');
    setConnectedText(true);
    addMessageList('You are connected to a new stranger. Say Hi!');
    setIsChatActive(true);
  };

  function closeConnection() {
    console.log('Closing connection...');
    addMessageList('The chat has ended.');
    sendDisconnectRequest();
    setEndChat(true)
    setIsChatActive(false);
    setConnectedText(false);
  }

  function handleConnect() {
    connectToUser();
  }

  return (
    <>
      <Provider store={store}>
        <BrowserRouter basename="/Reach-Alike">
          <Header
            loginHandler={loginHandler}
            registerHandler={registerHandler}
            nearMeHandler={nearMeHandler}
            endChat={endChat}
            setEndChat={setEndChat}
          />
          <Routes>
            <Route exact path="/" element={<MainScreen
              isChatActive={isChatActive}
              messages={messages}
              handleConnect={handleConnect}
            />} />
            <Route
              exact
              path="/chat"
              element={
                <ChatScreen
                  isChatActive={isChatActive}
                  messages={messages}
                  handleConnect={handleConnect}
                  sendMessage={sendMessage}
                  closeConnection={closeConnection}
                  user={user}
                  findUser={findUser}
                  setFindUser={setFindUser}
                  endChat={endChat}
                  setEndChat={setEndChat}
                  loginHandler={loginHandler}
                  registerHandler={registerHandler}
                />
              }
            />
            <Route
              exact
              path="/audio-chat"
              element={
                <AudioChat
                  // handleConnect={openConnectionAudio}
                  // handleClose={sendDisconnectRequest}
                  user={user}
                  findUser={findUser}
                  setFindUser={setFindUser}
                  endChat={endChat}
                  setEndChat={setEndChat}
                  loginHandler={loginHandler}
                  registerHandler={registerHandler}
                />
              }
            />
            <Route exact path="/term-condition" element={<TermCondition />} />
            <Route exact path="/policy" element={<Policy />} />
          </Routes>
        </BrowserRouter>
        {authLogin && (
          <Login
            asRef={ref}
            loginHandler={loginHandler}
            registerHandler={registerHandler}
          />
        )}
        {authRegister && (
          <Register
            asRef={ref}
            registerHandler={registerHandler}
            loginHandler={loginHandler}
          />
        )}
        {nearMe && <NearME asRef={ref} nearMeHandler={nearMeHandler} />}
      </Provider>
    </>
  );
}

export default App;
