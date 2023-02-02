import { useState, useEffect,useRef } from 'react';
import './App.css';
import Header from './layouts/header';
import MainScreen from './pages/main';
import ChatScreen from './pages/chat';
import AudioChat from './pages/audio-chat';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import NearME from './pages/near-me';
import TermCondition from './pages/term-condition';
import Policy from './pages/term-condition/index-policy';
import "./assets/css/media.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";

function App() {
  const ref = useRef()
  const [authLogin, setAuthLogin] = useState(false);
  const [authRegister, setAuthRegister] = useState(false);
  const [nearMe, setNearMe] = useState(false);
  const loginHandler = (e) => {
    setAuthLogin(!authLogin);
    if (authRegister) {
      setAuthRegister(false)
    } else if (nearMe) {
      setNearMe(false)
    }
  };
  const registerHandler = (e) => {
    setAuthRegister(!authRegister);
    if (authLogin) {
      setAuthLogin(false)
    } else if (nearMe) {
      setNearMe(false)
    }
  };
  const nearMeHandler = (e) => {
    setNearMe(!nearMe);
    if (authLogin) {
      setAuthLogin(false)
    } else if (authRegister) {
      setAuthRegister(false)
    }
  };
  useEffect(() => {
    const checkIfClickedOutside = e => {
      if (authLogin && ref.current && !ref.current.contains(e.target)) {
        setAuthLogin(false)
      }
      else if (authRegister && ref.current && !ref.current.contains(e.target)) {
        setAuthRegister(false)
      }
      else if (nearMe && ref.current && !ref.current.contains(e.target)) {
        setNearMe(false)
      }
    }

    document.addEventListener("mousedown", checkIfClickedOutside)

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside)
    }
  }, [authLogin,authRegister,nearMe])

  return (
    <>
      <Header loginHandler={loginHandler} registerHandler={registerHandler} nearMeHandler={nearMeHandler} />
      <BrowserRouter basename="/Reach-Alike">
        <Routes>
          {/* <Route exact path="/" element={<MainScreen authLogin={authLogin} authRegister={authRegister} loginHandler={loginHandler} registerHandler={registerHandler} nearMe={nearMe} nearMeHandler={nearMeHandler} />} /> */}
          <Route exact path="/" element={<MainScreen />} />
          <Route exact path="/chat" element={<ChatScreen />} />
          <Route exact path="/audio-chat" element={<AudioChat />} />
          <Route exact path="/term-condition" element={<TermCondition />} />
          <Route exact path="/policy" element={<Policy />} />
        </Routes>
      </BrowserRouter>
      {authLogin && <Login asRef={ref}  loginHandler={loginHandler} registerHandler={registerHandler} />}
      {authRegister && <Register asRef={ref}  registerHandler={registerHandler} loginHandler={loginHandler} />}
      {nearMe && <NearME asRef={ref} nearMeHandler={nearMeHandler} />}
    </>
  );
}

export default App;
