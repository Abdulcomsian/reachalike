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
import { Route, Routes, BrowserRouter, useLocation, HashRouter } from "react-router-dom";
import ReconnectingWebSocket from "reconnecting-websocket";
import { Provider } from "react-redux";
import store from "./store";
import { authLogin as LoginAction } from "./store/actions";

const BackendAddr = "websocket-dev.bayes-chat.com";
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

const App = () => {
  const ref = useRef();
  const [nearMe, setNearMe] = useState(false);
  // Auth Functionality
  const [user, setUser] = useState("");
  const [authLogin, setAuthLogin] = useState(false);
  const [authRegister, setAuthRegister] = useState(false);

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const [userCreds, setUserCreds] = useState({
    user_name: "",
    password: ""
  });

  useEffect(() => {
    setUserCreds({ user_name: userName, password: password });
  }, [userName, password]);

  const handleEmailChange = (e) => {
    setUserName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRegistration = (e) => {
    e.preventDefault();
    fetch("https://websocket-dev.bayes-chat.com/register", {
      method: "POST",
      body: JSON.stringify(userCreds),
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("token", data.token);
        // navigate to home page
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log(JSON.stringify(userCreds))
    fetch("https://websocket-dev.bayes-chat.com/login", {
      method: "POST",
      // headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userCreds)
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("token", data.token);
        // navigate to home page
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

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

  // Auth Functionality End

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
        LoginAction();
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
  const [findUser, setFindUser] = useState(false);
  const [endChat, setEndChat] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const [ws, setWs] = useState(null);
  const [websocketConnectionClosedIdx, setWebsocketConnectionClosedIdx] =
    useState(0);
  const [websocketConnectionErrorIdx, setWebsocketConnectionErrorIdx] =
    useState(0);
  const [connectedText, setConnectedText] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "",
      timestamp: "",
    },
  ]);
  const [isChatActive, setIsChatActive] = useState(false);
  const [isCaller, setIsCaller] = useState(false);

  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [typingPrompt, setTypingPrompt] = useState("");

  const [userStatus, setUserStatus] = useState("");

  const [percentMatch, setPercentMatch] = useState("");
  const [numConversations, setNumConverstations] = useState("");
  const [connectionInfo, setConnectionInfo] = useState({})

  useEffect(() => {
    const websocket = new ReconnectingWebSocket(
      `wss://${BackendAddr}/ws`,
      null,
      OptionsWebsocket
    );
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
        console.log("Websocket connected: ", ws);
      };

      ws.onmessage = async (event) => {
        let message = JSON.parse(event.data);
        console.log("Message from backend: " + JSON.stringify(message));
        // setPercentMatch(JSON.stringify(message.connection_info.percent_match))
        // setNumConverstations(JSON.stringify(message.connection_info.num_conversations))
        switch (message.type) {
          case "msg":
            console.log("Received message: " + message.ct);
            const newMessage = {
              text: message.ct,
              timestamp: new Date().getTime(),
            };
            setMessages([...messages, newMessage]);
            // sendNotTypingStatus();
            setOtherUserTyping(false);
            break;
          case "wr_start":
            console.log("Typing User: ", message.ct);
            setOtherUserTyping(true);
            setTypingPrompt(message.ct);
            break;
          case "wr_stop":
            console.log("Not typing User: ", message.ct);
            setOtherUserTyping(false);
            setTypingPrompt(message.ct);
            break;
          case 'rate_user':
            sendStarRating();
            break;
          case "cancel_connect_t":
            // sendDisconnectRequest();
            console.log("Message from cancel: ", message.ct);
            // setSearchingUser(false);
            // setConnectedText(false);
            // setIsConnected(false);
            // setIsChatActive(false);
            // setOtherUserTyping(false);
            // setEnd(true);
            setUserStatus("disconnected");
            break;
          case "cmd":
            switch (message.ct) {
              case "connect_a":
                isCaller = message.isCaller;
                await openConnectionAudio(isCaller);
                break;
              case "connect_t":
                openConnectionText();
                setIsConnected(true);
                setConnectionInfo(message.connection_info);
                setUserStatus("connected");
                break;
              case "disconnect":
                setUserStatus("disconnected");
                break;
              default:
                console.log("DEFAULT CASE REACHED IN CMD MESSAGE FROM SERVER");
                break;
            }
            break;

          case "info":
            addMessageList(message.ct);
            break;

          case "error":
            addMessageList("Error: " + message.ct);
            break;

          default:
            console.warn(
              "Message from server invalid: " + JSON.stringify(message)
            );
            break;
        }
      };

      ws.onclose = (event) => {
        setWebsocketConnectionClosedIdx(websocketConnectionClosedIdx + 1);
        console.warn("Connection closed with websocket");
        if (websocketConnectionClosedIdx % NumClosedWebsocketForWarning === 0) {
          alert(
            "Your internet connection seems to be unstable. The service has trouble connecting the server."
          );
        }
      };

      ws.onerror = (event) => {
        console.warn("Connection error with websocket");
        setWebsocketConnectionErrorIdx(websocketConnectionErrorIdx + 1);
        if (websocketConnectionErrorIdx % NumErrorsWebsocketForWarning === 0) {
          alert(
            "Your internet connection seems to be unstable. The service has trouble connecting the server."
          );
        }
      };
    }
  }, [ws, messages]);

  useEffect(() => {
    if (connectionInfo) {
      setPercentMatch(connectionInfo.percent_match);
      setNumConverstations(connectionInfo.num_conversations);
    }
  }, [connectionInfo]);

  const sendDisconnectRequest = async () => {
    console.log("Sending disconnect request to server...");
    let messageContent = {
      type: "cmd",
      ct: "disconnect",
    };
    ws.send(JSON.stringify(messageContent));
  };

  const cancelConnect = () => {
    console.log("Cancelling the connection...");
    let messageContent = {
      type: "cmd",
      ct: "cancel_connect_t",
    };
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
            type: "audio-ice-candidate",
            candidate: event.candidate,
          };
          ws.send(JSON.stringify(messageContent));
        }
      };

      if (isCaller) {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        const messageContent = {
          type: "audio-offer",
          offer: offer,
        };
        ws.send(JSON.stringify(messageContent));
      } else {
        // Wait for an offer from the caller
      }
    } catch (error) {
      console.error("Error while opening audio connection:", error);
    }
  };

  const addMessageList = (text) => {
    console.log("Adding message: " + text);
    setMessages((messages) => [...messages, text]);
  };

  const sendMessage = (message) => {
    if (connectedText) {
      const messageContent = {
        type: "msg",
        ct: message,
      };
      ws.send(JSON.stringify(messageContent));
      addMessageList("You: " + message);
      // sendNotTypingStatus();

    } else {
      console.warn("Cannot send message: not connected to another user");
    }
  };

  const connectToUser = () => {
    console.log("Sending connection request to server...");
    let messageContent = {
      type: "cmd",
      ct: "connect_t",
    };

    ws.send(JSON.stringify(messageContent));
  };

  const openConnectionText = () => {
    console.log("Text connection to stranger...");
    setConnectedText(true);
    setIsChatActive(true);
  };

  function closeConnection() {
    sendDisconnectRequest();
    setIsConnected(false);
  }

  function handleConnect() {
    setMessages([]);
    setRatingPopup(false);
    setEnd(true);
    setIsChatActive(false);
    connectToUser();
  }

  function sendTypingStatus() {
    const message = {
      type: "wr_start",
      ct: "typing",
    };
    ws.send(JSON.stringify(message));
  }

  function sendNotTypingStatus() {
    const message = {
      type: "wr_stop",
      ct: "",
    };
    ws.send(JSON.stringify(message));
  }

  console.log("Message from Connection: ", userStatus);

  // Chat Module States
  const [searchingUser, setSearchingUser] = useState(false);
  const [end, setEnd] = useState(false);
  const [endConfirm, setEndConfirm] = useState(false);
  const [startNew, setStartNew] = useState(false);
  const [ratingPopup, setRatingPopup] = useState(false);
  const [userIdentify, setUserIdentify] = useState(false);
  const [typingUser, setTypingUser] = useState("");

  const onClickEndBtn = () => {
    setEnd(true);
  };

  const onClickEndConfirmBtn = () => {
    setStartNew(true);
    setEnd(true);
    setEndConfirm(true);
    setRatingPopup(true);
    // closeConnection();
    setUserIdentify(true);
    sendDisconnectRequest();
  };

  const onClickConfirm = () => {
    setStartNew(true);
    setEnd(true);
    setEndConfirm(true);
    setRatingPopup(true);
    // closeConnection();
    // sendDisconnectRequest();
  };

  const onClickStartNewChatBtn = () => {
    handleConnect();
    setIsChatActive(false);
    setOtherUserTyping(false);
    setMessages([]);
    setUserIdentify(false);
  };

  // Star Rating Implementation
  const [starRating, setStarRating] = useState(0);
  function sendStarRating() {
    ws.send(JSON.stringify({ "type": "cmd", "ct": "rate_user", "stars": starRating }));
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
            isChatActive={isChatActive}
            onClickEndConfirmBtn={onClickEndConfirmBtn}
            endConfirm={endConfirm}
            closeConnection={closeConnection}
            cancelConnect={cancelConnect}
            starRating={starRating}
            setStarRating={setStarRating}
            sendStarRating={sendStarRating}
            userIdentify={userIdentify}
            isConnected={isConnected}
            searchingUser={searchingUser}
          />
          <Routes>
            <Route
              exact
              path="/"
              element={
                <MainScreen
                  isChatActive={isChatActive}
                  messages={messages}
                  setMessages={setMessages}
                  handleConnect={handleConnect}
                  onClickStartNewChatBtn={onClickStartNewChatBtn}
                  setRatingPopup={setRatingPopup}
                />
              }
            />
            <Route
              exact
              path="/chat"
              element={
                <ChatScreen
                  typingUser={typingUser}
                  setTypingUser={setTypingUser}
                  userIdentify={userIdentify}
                  setUserIdentify={setUserIdentify}
                  sendNotTypingStatus={sendNotTypingStatus}
                  sendTypingStatus={sendTypingStatus}
                  onClickEndBtn={onClickEndBtn}
                  onClickEndConfirmBtn={onClickEndConfirmBtn}
                  onClickConfirm={onClickConfirm}
                  onClickStartNewChatBtn={onClickStartNewChatBtn}
                  searchingUser={searchingUser}
                  setSearchingUser={setSearchingUser}
                  end={end}
                  setEnd={setEnd}
                  endConfirm={endConfirm}
                  setEndConfirm={setEndConfirm}
                  startNew={startNew}
                  setStartNew={setStartNew}
                  ratingPopup={ratingPopup}
                  setRatingPopup={setRatingPopup}
                  setOtherUserTyping={setOtherUserTyping}
                  userStatus={userStatus}
                  isChatActive={isChatActive}
                  setIsChatActive={setIsChatActive}
                  messages={messages}
                  handleConnect={handleConnect}
                  sendMessage={sendMessage}
                  closeConnection={closeConnection}
                  typingPrompt={typingPrompt}
                  setTypingPrompt={setTypingPrompt}
                  otherUserTyping={otherUserTyping}
                  setMessages={setMessages}
                  isConnected={isConnected}
                  user={user}
                  findUser={findUser}
                  setFindUser={setFindUser}
                  endChat={endChat}
                  setEndChat={setEndChat}
                  loginHandler={loginHandler}
                  registerHandler={registerHandler}
                  starRating={starRating}
                  setStarRating={setStarRating}
                  sendStarRating={sendStarRating}
                  percentMatch={percentMatch}
                  numConversations={numConversations}
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
            userName={userName}
            setUserName={setUserName}
            password={password}
            setPassword={setPassword}
            handleEmailChange={handleEmailChange}
            handlePasswordChange={handlePasswordChange}
            handleRegistration={handleRegistration}
            handleLogin={handleLogin}
          />
        )}
        {authRegister && (
          <Register
            asRef={ref}
            registerHandler={registerHandler}
            loginHandler={loginHandler}
            userName={userName}
            setUserName={setUserName}
            password={password}
            setPassword={setPassword}
            handleEmailChange={handleEmailChange}
            handlePasswordChange={handlePasswordChange}
            handleRegistration={handleRegistration}
          />
        )}
        {nearMe && <NearME asRef={ref} nearMeHandler={nearMeHandler} />}
      </Provider>
    </>
  );
};

export default App;
