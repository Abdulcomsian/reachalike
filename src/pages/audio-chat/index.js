import React, { useState, useEffect, useRef } from "react";
import SearchUser from "../../layouts/search-user";
import "./style.css";
import images from "../../constant/images";
import ChatScreen from "../chat";
import { Link } from "react-router-dom";
import RatingAudio from "../../components/RatingAudio/RatingAudio";

// This is the code for the design and implementation of
// Audio Chat Module of the App

const AudioChat = (props) => {
  // const [findUser, setFindUser] = useState(false);
  // const [endChat, setEndChat] = useState(false);
  // These are the props coming from the parent component
  const {
    user,
    handleChatConnect,
    setMessages,
    findUser,
    setFindUser,
    handleAudioConnect,
    selectedGroup,
    endChat,
    setEndChat,
    setSearchingUser,
    chatScreen,
    handleClose,
    setEndConfirm,
    onClickEndBtn,
    userStatus,
    onClickConfirm, startChat,
    setStartChat,
    setEnd,
    setChatType,
    sendStarRating,
    setStarRating
  } = props;
  const ref = useRef();
  //These are all the state variables that are being used in the component rendering
  const [mute, setMute] = useState(false);
  const [requestToChat, setRequestToChat] = useState(true);
  const [hide, setHide] = useState(true);

  // This side effect sets the dummy chat connection with the other user
  useEffect(() => {
    // We are calling a setTimeout method to show the connecting animation before
    // the users get connected to each other.

    // setTimeout(() => {
    //   setFindUser(true);
    //   setHide(true);
    // }, 2000);
    if (findUser) {
      setFindUser(true);
      setEndConfirm(false);
      setEnd(false)
      setEndChat(false)
    }
  }, [findUser]);

  // ********** UseEffect Running on Mount ********** //
  useEffect(() => {
    if (userStatus === "disconnected") {
      // onClickEndConfirmBtn();
      setEndChat(true)
      setStartChat(false)
      onClickConfirm();
       setMessages([]);
    }
  }, [userStatus]);

  // This state variable and the function under it are responsible for
  // toggling the user rating modal's display
 
  const modalUserRatingClose = (val) => {
    setHide(false);
    setEndChat(true);
  };

  return (
    <>
      <div className={startChat && "d-flex"}>
        <div
          className={
            startChat ? "audio_chat_wrapper w-40" : "audio_chat_wrapper"
          }
          style={{ height: "100vh" }}
        >
          {/* This is where the conditional rendering of the component starts */}
          {/*  */}
          {findUser ? (
            <>
              <div
                className={
                  startChat
                    ? "audio-body flex-column d-flex "
                    : "audio-body d-flex "
                }
                style={{ height: "80vh" }}
              >
                <div
                  className={
                    startChat
                      ? "audio-body-left w-100 d-flex align-items-center justify-content-center"
                      : !endChat
                        ? "audio-body-left d-flex align-items-center justify-content-center"
                        : "audio-body-left w-100 d-flex align-items-center justify-content-center"
                  }
                >
                  <div className="common-audio">
                    <img src={images.audio_one} className="img-fluid" />
                  </div>
                </div>
                {!endChat && (
                  <>
                    {" "}
                    <div
                      className={startChat ? "spacer-column" : "spacer"}
                    ></div>
                    <div
                      className={
                        startChat
                          ? "audio-body-right w-100 d-flex align-items-center justify-content-center"
                          : "audio-body-right d-flex align-items-center justify-content-center"
                      }
                    >
                      <div className="common-audio">
                        <img src={images.audio_two} className="img-fluid" />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="audio-footer d-flex align-items-center justify-content-center flex-column">
                {endChat ? (
                  <>
                    <p className="stranger-disconnected">
                      Stranger has disconnected.
                    </p>
                    <div className="footer-button">
                      <button
                        className="btn btn-info bg-info px-3"
                        onClick={() => [
                          setFindUser(false),
                          setEndChat(false),
                          setStartChat(false),
                          setHide(true),
                          setChatType("Audio"),
                          handleAudioConnect(selectedGroup)
                        ]}
                      >
                        New Audio Chat
                      </button>
                      <span className="inter-600 ms-2 mr-2">or{"  "}</span>
                      <Link
                        to={`/chat/${selectedGroup}`}
                        className="btn btn-primary bg-primary px-3 py-2"
                        onClick={() => {
                          setChatType("Text")
                          handleChatConnect(selectedGroup)
                          setMessages([]);
                        }}
                      >
                        Switch to <span>Text</span>
                      </Link>
                    </div>
                    {hide ? (
                      <RatingAudio
                        user={user}
                        asRef={ref}
                        modalUserRatingClose={modalUserRatingClose}
                        loginHandler={props.loginHandler}
                        registerHandler={props.registerHandler}
                        setEndChat={setEndChat}
                        sendStarRating={sendStarRating}
                        setStarRating={setStarRating}
                      />
                    ) : (
                      ""
                    )}
                  </>
                ) : (
                  <div className="footer-button-group">
                    <button
                      className="common-footer-btn end-call-btn"
                      onClick={() => {
                        setEndChat(true);
                        // setFindUser(false)
                        // onClickEndBtn()
                        handleClose();
                      }}
                    >
                      <img src={images.call_end} />
                    </button>
                    <button
                      className="common-footer-btn"
                      onClick={() => setMute(!mute)}
                    >
                      <i
                        class={
                          mute
                            ? "fa-solid fa-microphone-slash"
                            : "fa-solid fa-microphone"
                        }
                      ></i>
                    </button>
                    <button className="common-footer-btn" onClick={() => setStartChat(!startChat)}>
                      <i class="fa-solid fa-envelope"></i>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div>
              <SearchUser />
            </div>
          )}
        </div>
        {/* {startChat && <ChatScreen requestToChat={requestToChat} setSearchingUser={setSearchingUser} />} */}
        <div className="audio_call_chat" style={{ display: startChat === true ? "" : "none" }}>{chatScreen()}</div>
      </div>
    </>
  );
};
export default AudioChat;
