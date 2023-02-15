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
  const [connectedText, setConnectedText] = useState(false)
  const [websocketConnectionClosedIdx, setWebsocketConnectionClosedIdx] = useState(0)
  const [websocketConnectionErrorIdx, setWebsocketConnectionErrorIdx] = useState(0)
  const [messages, setMessages] = useState([])
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

  const handleError = (e) => {
    console.warn('Connection error with websocket')
    setWebsocketConnectionErrorIdx(websocketConnectionErrorIdx + 1)
    if (websocketConnectionErrorIdx % numErrorsWebsocketForWarning === 0) {
      alert("Your internet connection seems to be unstable. The service has trouble connecting the server.")
    }
  }

  const [wsConnection, setWsConnection] = useState()

  const handleOpen = (event) => {
    event.preventDefault()
  }

  const handleMessage = async (event) => {
    event.preventDefault()
    let message = JSON.parse(event.data)
    console.log(message)
    // console.log('Message from backend: ' + JSON.stringify(message))
    // switch (message.type) {
    //   case 'msg':
    //     if (connectedText) {
    //       setMessages([...messages, "Stranger: " + message.ct])
    //     }
    //     break;

    //   case 'cmd':
    //     handleCommand(message.ct);
    //     break;

    //   default:
    //     console.log('DEFAULT CASE REACHED IN MESSAGE FROM SERVER');
    //     break;
    // }
  }

  // const handleCommand = (cmd) => {
  //   switch (cmd) {
  //     case 'connect_a':
  //       // openConnectionAudio(isCaller)
  //       break;

  //     case 'connect_t':
  //       openConnectionText();
  //       break;

  //     case 'disconnect':
  //       closeConnection();
  //       break;

  //     default:
  //       console.log('DEFAULT CASE REACHED IN CMD MESSAGE FROM SERVER');
  //       break;
  //   }
  // }
  // const closeConnection = () => {
  //   console.log("Connection closed")
  //   setConnectedText(false);
  // };

  // const openConnectionText = () => {
  //   setConnectedText(true);
  // };

  const handleConnect = () => {
    const wsServerConnection = new ReconnectingWebSocket(`wss://${backendAddr}/ws`, null, optionsWebsocket);
    wsServerConnection.addEventListener('error', handleError);
    wsServerConnection.addEventListener('open', handleOpen);
    wsServerConnection.onmessage = handleMessage;

    setWsConnection(wsServerConnection)
    console.log("Server Object: ", wsServerConnection)
  };

  const handleClose = () => {
    if (wsConnection) {
      wsConnection.close();
    }
  };

  return (
    <>
      <BrowserRouter basename="/Reach-Alike">
        <Header
          loginHandler={loginHandler}
          registerHandler={registerHandler}
          nearMeHandler={nearMeHandler}
          endChat={endChat}
          setEndChat={setEndChat}
        />
        <Routes>
          {/* <Route exact path="/" element={<MainScreen authLogin={authLogin} authRegister={authRegister} loginHandler={loginHandler} registerHandler={registerHandler} nearMe={nearMe} nearMeHandler={nearMeHandler} />} /> */}
          <Route exact path="/" element={<MainScreen handleConnect={handleConnect} handleClose={handleClose} wsConnection={wsConnection} setWsConnection={setWsConnection} />} />
          <Route exact path="/chat" element={<ChatScreen handleConnect={handleConnect} handleClose={handleClose} wsConnection={wsConnection} setWsConnection={setWsConnection} user={user} findUser={findUser} setFindUser={setFindUser} endChat={endChat} setEndChat={setEndChat} loginHandler={loginHandler}
            registerHandler={registerHandler} />} />
          <Route exact path="/audio-chat" element={<AudioChat user={user} findUser={findUser} setFindUser={setFindUser} endChat={endChat} setEndChat={setEndChat} loginHandler={loginHandler}
            registerHandler={registerHandler} />} />
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
    </>
  );
}

export default App;
