import { useState, useEffect, useRef } from "react";
import "./App.css";
import Header from "./layouts/header";
import MainScreen from "./pages/main";
import ChatScreen from "./pages/chat";
import AudioChat from "./pages/audio-chat";
import Register from "./pages/auth/register";
import Login from "./pages/auth/login";
import NearME from "./pages/near-me";
import TermCondition from "./pages/term-condition";
import Policy from "./pages/term-condition/index-policy";
import "./assets/css/media.css";
import { Route, Routes, BrowserRouter, useLocation, HashRouter, useNavigate } from "react-router-dom";
import ReconnectingWebSocket from "reconnecting-websocket";
import { Provider } from "react-redux";
import store from "./store";
import { authLogin as LoginAction } from "./store/actions";
import axios from "axios";
import NewChat from "./pages/new-chat";
import { toast, Toaster } from "react-hot-toast";

// Some constants
const BackendAddr = "websocket-dev.bayes-chat.com";
const NumClosedWebsocketForWarning = 5;
const NumErrorsWebsocketForWarning = 5;

// Websocket Options
const OptionsWebsocket = {
  debug: true,
  automaticOpen: true,
  reconnectInterval: 5000,
  maxReconnectInterval: 60000,
  reconnectDecay: 2,
  timeoutInterval: 5000,
  maxReconnectAttempts: 6,
};

// Main App Component
const App = () => {
  //State Variables
  const ref = useRef();
  const [nearMe, setNearMe] = useState(false);

  // Auth Functionality
  const [user, setUser] = useState("");
  const [authLogin, setAuthLogin] = useState(false);
  const [authRegister, setAuthRegister] = useState(false);

  // Authentication Field State Variables
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("Default");
  const [userToken, setUserToken] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();


  // Authentication State Object
  const [userCreds, setUserCreds] = useState({
    user_name: "",
    password: ""
  });

  //Setting Values from Input Fields to the Authentication State Object
  useEffect(() => {
    setUserCreds({ user_name: userName, password: password });
  }, [userName, password]);

  // Handling Email Input Changes
  const handleEmailChange = (e) => {
    setUserName(e.target.value);
  };

  // Handling Password Input Changes
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Handling Confirm Password Input Changes
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const logoutHandler = () => {
    console.log("logout");
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUserToken(null);
    // window.location.reload()
    toast.success("Logout successfully", {
      style: {
        borderRadius: '999px',
        background: '#333',
        color: '#fff',
      }
    });
  }

  // Handling Registration API
  // const handleRegistration = (e) => {
  //   e.preventDefault();
  //   //Checking to see if the value in the password field matches with the confirm password field
  //   if (password !== confirmPassword) {
  //     // alert("Password doesn't match!");
  //     toast.error("Passwords does not match!", {
  //       style: {
  //         borderRadius: '999px',
  //         background: '#333',
  //         color: '#fff',
  //       }
  //     });
  //     return;
  //   }
  //   // if above condition turns to be false, then this code executes
  //   // where I am making the register user call to the register api
  //   // with the user data that was saved in the userCreds object earlier
  //   axios.post("https://websocket-dev.bayes-chat.com/register", userCreds, {
  //     headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" }
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       // After the successful registration process
  //       // setting up the token in the sessionStorage of the browser
  //       sessionStorage.setItem("token", data.token);
  //       setAuthLogin(false);
  //       toast.success("Registration Successfully!", {
  //         style: {
  //           borderRadius: '999px',
  //           background: '#333',
  //           color: '#fff',
  //         }
  //       });
  //       setUserName("")
  //       setPassword("")
  //       setConfirmPassword("")
  //     })
  //     .catch((error) => {
  //       // if api call fails, it will return errors
  //       toast.error("Some error occured! Try again.", {
  //         style: {
  //           borderRadius: '999px',
  //           background: '#333',
  //           color: '#fff',
  //         }
  //       });
  //       console.error("Error:", error);
  //     });
  // };

  const handleRegistration = (e) => {
    e.preventDefault();
    //Checking to see if the value in the password field matches with the confirm password field
    if (password !== confirmPassword) {
      // alert("Password doesn't match!");
      toast.error("Passwords does not match!", {
        style: {
          borderRadius: '999px',
          background: '#333',
          color: '#fff',
        }
      });
      return;
    }
    axios.post("https://websocket-dev.bayes-chat.com/register", userCreds, {
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" }
    })
      .then((response) => {
        if (response.data.token != null) {

          // sessionStorage.removeItem("token_Guest", response.data.token);
          // localStorage.removeItem("token_Guest", response.data.token);

          sessionStorage.setItem("token", response.data.token);
          localStorage.setItem("token", response.data.token);
          setAuthRegister(false);
          toast.success("Registration Successfully!", {
            style: {
              borderRadius: '999px',
              background: '#333',
              color: '#fff',
            }
          });
          setUserName("")
          setPassword("")
          setConfirmPassword("")
        }
        else {
          toast.error(response.data.Error, {
            style: {
              borderRadius: '999px',
              background: '#333',
              color: '#fff',
            }
          });
        }
      })
      .catch((error) => {
        toast.error("Some error occured! Try again.", {
          style: {
            borderRadius: '999px',
            background: '#333',
            color: '#fff',
          }
        });
        console.error("Error:", error);
      });
  }

  const handleLogin = (e) => {
    e.preventDefault();
    //Taking values from the userCreds object and sending it the
    //Login API where it checks for the credentials to be matching the
    // credentials that are saved in the database.
    axios.post('https://websocket-dev.bayes-chat.com/login', userCreds, {
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
    })
      .then(response => {
        //Setting up the token coming from the backend to the sessionStorage
        //of the browser after successful login
        if (response.data.token != null) {

          // for new token
          localStorage.setItem("token", response.data.token)
          sessionStorage.setItem("token", response.data.token)
          setUserToken(response.data.token);
          setAuthLogin(false);
          toast.success("Logged In Successfully!", {
            style: {
              borderRadius: '999px',
              background: '#333',
              color: '#fff',
            }
          });
          setUserName("")
          setPassword("")
        }
        else {
          toast.error(response.data.error, {
            style: {
              borderRadius: '999px',
              background: '#333',
              color: '#fff',
            }
          });
        }
      })
      .catch(error => {
        //If login fails then it will return an error here
        toast.error("Authentication Error! Kindly check your creds", {
          style: {
            borderRadius: '999px',
            background: '#333',
            color: '#fff',
          }
        });
        console.error(error);
      });
  }

  // This function controls the Login Popup to open and close
  const loginHandler = (e) => {
    setAuthLogin(!authLogin);
    if (authRegister) {
      setAuthRegister(false);
    } else if (nearMe) {
      setNearMe(false);
    }
  };

  // This function controls the Registeration Popup to open and close
  const registerHandler = (e) => {
    setAuthRegister(!authRegister);
    if (authLogin) {
      setUser("admin");
      setAuthLogin(false);
    } else if (nearMe) {
      setNearMe(false);
    }
  };

  // This function handles the Near me popup toggling process
  const nearMeHandler = (e) => {
    setNearMe(!nearMe);
    if (authLogin) {
      setAuthLogin(false);
    } else if (authRegister) {
      setAuthRegister(false);
    }
  };

  // this effect re-renders the component everytime the any popup is toggled
  // this also handling the click functionalities of the pointer if it's inside the scope
  // of that popup or outside of it. If the user clicks outside, it will close the
  // the popup automatically
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
  //Connection Object State Variables
  const [ws, setWs] = useState(null);
  const [websocketConnectionClosedIdx, setWebsocketConnectionClosedIdx] =
    useState(0);
  const [websocketConnectionErrorIdx, setWebsocketConnectionErrorIdx] =
    useState(0);
  const [connectedText, setConnectedText] = useState(false);
  //Messages Object State Variable
  const [messages, setMessages] = useState([
    {
      text: "",
      timestamp: "",
    },
  ]);


  //Connection Status variables that will check for different
  //actions that will be executed after the connection between
  //two users is established or not
  const [isChatActive, setIsChatActive] = useState(false);
  const [isCaller, setIsCaller] = useState(false);
  //checking for typing status of users
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [typingPrompt, setTypingPrompt] = useState("");

  const [userStatus, setUserStatus] = useState("");
  //checking for Percent Match and num of conversations
  const [percentMatch, setPercentMatch] = useState("");
  const [numConversations, setNumConverstations] = useState("");
  const [connectionInfo, setConnectionInfo] = useState({})

  //Establishing a connection to the websocket when the component
  //renders for the first time in the browser window
  const connectionToWebSocket = () => {
    const websocket = new ReconnectingWebSocket(
      `wss://${BackendAddr}/ws`,
      null,
      OptionsWebsocket
    );
    console.log(websocket);
    //Setting response of websocket into the websocket state object
    setWs(prevState => websocket);

    return () => {
      if (websocket) {
        websocket.close();
        setWs(null);
      }
    };
  }

  useEffect(() => {
    connectionToWebSocket()
  }, []);

  //After setting up the state object, the websocket functions
  //are being called and their functionalities are being used
  //accordingly in this useEffect
  useEffect(() => {
    if (ws) {
      //opening the connection
      ws.onopen = () => {
        console.log("Websocket connected: ", ws);
      };
      //function runs when a message is sent or received
      ws.onmessage = async (event) => {
        //returns a json object with the data containing the message
        //converting JSON data in string form into Javascript objects
        let message = JSON.parse(event.data);
        // then the type of message is checked and
        //functions are performed accordingly
        //using the switch statement
        switch (message.type) {
          //checks for the 'msg' case
          case "msg":
            // creates a newMessage object with the content of message
            // and the timestamp on which it was sent
            const newMessage = {
              text: message.ct,
              timestamp: new Date().getTime(),
            };
            // Messages state object is filled up with the messages array
            setMessages([...messages, newMessage]);
            // other users typign status is set to false after the message
            // is added to the array
            setOtherUserTyping(false);
            break;
          //checks for the 'wr_start' case
          //this case handles the user typing status
          case "wr_start":
            setOtherUserTyping(true);
            setTypingPrompt(message.ct);
            break;
          //checks for the 'wr_stop' case
          //this case handles the user not typing status
          case "wr_stop":
            setOtherUserTyping(false);
            setTypingPrompt(message.ct);
            break;
          //checks for the 'rate_user' case
          //this case handles the user's rating
          case 'rate_user':
            sendStarRating();
            break;
          //checks for the 'cancel_connect_t' case
          //if the user is not connected to another user
          //this case allows that user to cancel the request
          case "cancel_connect_t":
            setUserStatus("disconnected");
            break;
          //checks for the 'cmd' case
          case "cmd":
            //this switch statement checks for the commands being sent
            //to the websocket
            switch (message.ct) {
              //checks for the audio connection
              //not functional right now, just added up some dummy functionality
              case "connect_a":
                isCaller = message.isCaller;
                await openConnectionAudio(isCaller);
                break;
              //checks for the text connection
              case "connect_t":
                openConnectionText();
                setIsConnected(true);
                setConnectionInfo(message.connection_info);
                setUserStatus("connected");
                break;
              //checks for the disconnected user
              case "disconnect":
                setUserStatus("disconnected");
                break;
              case "user_token":
                console.log("token from backend: ", message)
                setUserToken(message.ct)
                break;
              //default case
              default:
                console.log("DEFAULT CASE REACHED IN CMD MESSAGE FROM SERVER");
                break;
            }
            break;
          //gets the information of messages from the server
          case "info":
            addMessageList(message.ct);
            break;
          //gets the information of any errors in the server
          case "error":
            addMessageList("Error: " + message.ct);
            break;
          //checks for the default case
          default:
            console.warn(
              "Message from server invalid: " + JSON.stringify(message)
            );
            break;
        }
      };
      //function called when the connection with the websocket is closed
      ws.onclose = (event) => {
        setWebsocketConnectionClosedIdx(websocketConnectionClosedIdx + 1);
        console.warn("Connection closed with websocket");
        if (websocketConnectionClosedIdx % NumClosedWebsocketForWarning === 0) {
          alert(
            "Your internet connection seems to be unstable. The service has trouble connecting the server."
          );
        }
      };
      //function called if the websocket is giving any error
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
  }, [ws, messages]); //component re-renders itself everytime when a connection status changes or messages array is updated


  //this effect runs when the user's connection info is updated and maps the Percent Match and
  //Number of Conversations with the specific user is changed or updated
  useEffect(() => {
    if (connectionInfo) {
      setPercentMatch(connectionInfo.percent_match);
      setNumConverstations(connectionInfo.num_conversations);
    }
  }, [connectionInfo]); //everytime connectionInfo object is updated, this effect runs

  //This function handles the disconnection of the users with each other
  const sendDisconnectRequest = async () => {
    let messageContent = {
      type: "cmd",
      ct: "disconnect",
    };
    ws.send(JSON.stringify(messageContent));
  };

  //This function handles the connection cancellation before the users are connected to each other
  const cancelConnect = () => {
    let messageContent = {
      type: "cmd",
      ct: "cancel_connect_t",
      group: selectedGroup
    };
    ws.send(JSON.stringify(messageContent));
  }

  //This function handles the Audio connection (This functionality is disabled for now)
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

  //This function is adding a single message to the messages array
  const addMessageList = (text) => {
    setMessages((messages) => [...messages, text]);
  };

  //This function is responsible for sending the messages
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

  //This function is responsible for connecting a user with another for chatting
  const connectToUser = (item) => {
    if (userToken !== null || localStorage.getItem("token")) {
      let messageContent = {
        type: "cmd",
        ct: "connect_t",
        group: item,
        token: userToken !== null ? userToken : localStorage.getItem("token")
      };
      ws?.send(JSON.stringify(messageContent));
    }
    // This might be wrong
    else {
      // setTokenWithoutAuth();
      let messageContent = {
        type: "cmd",
        ct: "connect_t",
        group: item,
        token: localStorage.getItem("token_Guest")
      };
      ws?.send(JSON.stringify(messageContent))

      if (!localStorage.getItem("token_Guest")) {
        ws?.addEventListener('message', event => {
          console.log("log", event.data);
          const message = JSON.parse(event.data);
          if (message.type == "user_token" && message.ct !== "disconnect" && message.ct !== "connect_t" && message.ct !== "The other user has trouble with his connection or has disconnected. You can wait for his reconnection or end the conversation.") {
            localStorage.setItem("token_Guest", message.ct)
            sessionStorage.setItem("token_Guest", message.ct)
          }

        });
      }
    }
  };

  const setTokenWithoutAuth = () => {
    const guestToken = localStorage.getItem("token_Guest")
    const messageContent = {
      type: 'user_token',
      ct: userToken ? userToken : guestToken
    };
    ws?.send(JSON.stringify(messageContent));
  }

  //This function is handling the display of the text that is shown when a user is connected to another
  //The text is shown for a specific time
  const openConnectionText = () => {
    setConnectedText(true);
    setIsChatActive(true);
  };

  //This function is responsible for closing the connection between the two users
  function closeConnection() {
    sendDisconnectRequest();
    setIsConnected(false);
  }

  //When the user is connected, this function resets all the necessary state variables
  function handleConnect(item) {
    setMessages([]);
    setRatingPopup(false);
    setEnd(true);
    setIsChatActive(false);
    connectToUser(item);
  }

  //When the other user starts typing, this function runs and sends a command to the websocket for showing the typing status of the user
  function sendTypingStatus() {
    const message = {
      type: "wr_start",
      ct: "typing",
    };
    ws.send(JSON.stringify(message));
  }

  //When the other user stop typing, this function runs and sends a command to the websocket for hiding the typing status of the user
  function sendNotTypingStatus() {
    const message = {
      type: "wr_stop",
      ct: "",
    };
    ws.send(JSON.stringify(message));
  }

  // States that are responsible for the actions that are done on the chat page
  const [searchingUser, setSearchingUser] = useState(false);
  const [end, setEnd] = useState(false);
  const [endConfirm, setEndConfirm] = useState(false);
  const [startNew, setStartNew] = useState(false);
  const [ratingPopup, setRatingPopup] = useState(false);
  const [userIdentify, setUserIdentify] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [groups, setGroups] = useState([]);

  //Sets the End state to true
  //This state is responsible for showing the confirm button
  //after the user clicks end
  const onClickEndBtn = () => {
    setEnd(true);
  };

  // This function is responsible for hadling the functionality after the user disconnects the chat
  const onClickEndConfirmBtn = () => {
    setStartNew(true);
    setEnd(true);
    setEndConfirm(true);
    setRatingPopup(true);
    // closeConnection();
    setUserIdentify(true);
    sendDisconnectRequest();
  };

  // This function is responsible for hadling the functionality after the user disconnects the chat from the navbar
  const onClickConfirm = () => {
    setStartNew(true);
    setEnd(true);
    setEndConfirm(true);
    setRatingPopup(true);
    // closeConnection();
    // sendDisconnectRequest();
  };

  // This funtion is responsible for starting a new chat from the button on the left of the message input
  const onClickStartNewChatBtn = (e) => {
     handleConnect(selectedGroup);
    setIsChatActive(false);
    setOtherUserTyping(false);
    setMessages([]);
    setUserIdentify(false);
    navigate(`/${selectedGroup}`);
  };

  useEffect(() => {
    fetch("https://websocket-dev.bayes-chat.com/groups")
      .then(res => res.json())
      .then(data => {
        const transformedData = data.groups.map((groupName, index) => {
          return { id: index, name: groupName }
        })
        setGroups(transformedData)
      })
      .catch(e => console.log(e.message))
  }, [])

  const chatScreen = () => {
    return (
      <ChatScreen
        userToken={userToken}
        setUserToken={setUserToken}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
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
    )
  }

  // Functionality for star rating
  const [starRating, setStarRating] = useState(0);
  function sendStarRating() {
    ws.send(JSON.stringify({ "type": "cmd", "ct": "rate_user", "stars": starRating }));
  }

  useEffect(() => {
    if (location.pathname !== "/" && location.pathname !== "/chat/Near%20Me" && location.pathname !== "/term-condition" && location.pathname !== "/policy") {
      const splits = location.pathname.split("/")
      setSelectedGroup(splits[1])
      handleConnect(splits[1]);
    }
  }, [ws]);
  // Component rendering starts here
  return (
    <>
      <Provider store={store}>
        {/* Browser Router from React Router DOM */}
        {/* The basename attribute sets the initial route https://localhost:3000/Reach-Alike */}
        {/* <BrowserRouter basename="/Reach-Alike"> */}
        {/* Header/Navigation component */}
        {/* This is placed outside of the Routes because if will not change and will appear on every other screen/layout */}
        <Header
          //functions and states passed as props to the component that are being accessed in the component to perform different actions
          loginHandler={loginHandler}
          registerHandler={registerHandler}
          logoutHandler={logoutHandler}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          userToken={userToken}
          setUserToken={setUserToken}
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
          handleConnect={handleConnect}
        />
        <Toaster position="top-right" />
        {/* The main routes start here that contain the logic of all the components being rendered on the screen */}
        <Routes>
          {/* Main Screen Route and Component */}
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
                selectedGroup={selectedGroup}
              />
            }
          />
          {/* Chat Screen Route and Component */}
          {/* states and functions are passed as props to the component */}
          {/* <Route
            exact
            path="/chat"
            element={
              <ChatScreen
                userToken={userToken}
                setUserToken={setUserToken}
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
          /> */}
          {/* Audio Chat Screen Route and Component */}
          {/* <Route
            exact
            path={`/${selectedGroup}`}
            element={chatScreen()}
          /> */}

          {groups.map((route) => (
            <Route
              exact
              key={route.id}
              path={`/${route.name}`}
              element={chatScreen()}
            />
          ))}


          {/* states and functions are passed as props to the component */}
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
          {/* Terms and Conditions Screen Route and Component */}
          <Route exact path="/term-condition" element={<TermCondition />} />

          {/* Privacy Policy Screen Route and Component */}
          <Route exact path="/policy" element={<Policy />} />
          <Route
            exact
            path="/new-chat"
            element={
              <NewChat
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
        </Routes>
        {/* </BrowserRouter> */}
        {/* Authenticated Routes start here */}
        {
          // Checking if the user is authenticated or not
          authLogin && (
            // Login component with its props
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
          // register component with its props
          <Register
            asRef={ref}
            registerHandler={registerHandler}
            loginHandler={loginHandler}
            userName={userName}
            setUserName={setUserName}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            handleEmailChange={handleEmailChange}
            handlePasswordChange={handlePasswordChange}
            handleConfirmPasswordChange={handleConfirmPasswordChange}
            handleRegistration={handleRegistration}
          />
        )}
        {/* Near Me component with its props and refs */}
        {nearMe && <NearME asRef={ref} nearMeHandler={nearMeHandler} />}
      </Provider>
    </>
  );
};

export default App;
