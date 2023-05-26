import React, { useState, useEffect, useRef, useCallback, createRef } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import images from "../../constant/images";
import SearchUser from "../../layouts/search-user";
import { Link } from "react-router-dom";
import EndChatModal from "../../components/EndChat/ConfirmationModal";
import moment from "moment/moment";
import { Button, Tooltip } from "reactstrap";

// Emoji Picker

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { toast, Toaster } from "react-hot-toast";

const ChatScreen = (props) => {
  const ref = useRef();
  const {
    messages,
    isChatActive,
    handleConnect,
    requestToChat,
    user,
    setEndChat,
    sendMessage,
    otherUserTyping,
    setOtherUserTyping,
    setMessages,
    userStatus,
    onClickEndBtn,
    onClickEndConfirmBtn,
    onClickConfirm,
    onClickStartNewChatBtn,
    searchingUser,
    setSearchingUser,
    end,
    setEnd,
    endConfirm,
    setEndConfirm,
    setStartNew,
    ratingPopup,
    setRatingPopup,
    sendTypingStatus,
    sendNotTypingStatus,
    userIdentify,
    setUserIdentify,
    typingUser,
    setTypingUser,
    starRating,
    setStarRating,
    sendStarRating,
    getContainerStyle,
    loginHandler,
    registerHandler,
    userToken,
    setUserToken, handleAudioConnect, selectedGroup,
    setChatType
  } = props;

  const [newChat, setNewChat] = useState(false);
  const [connectText, setConnectText] = useState(true);
  const navigate = useNavigate();

  // ********** My States ********** //

  // ********** UseEffect Running on Mount ********** //
  useEffect(() => {
    if (userStatus === "disconnected") {
      // onClickEndConfirmBtn();
      onClickConfirm();
      // setMessages([]);
    }
  }, [userStatus]);

  useEffect(() => {
    if (isChatActive) {
      setSearchingUser(true);
      setStartNew(false);
      setEnd(false);
      setEndConfirm(false);
      setRatingPopup(false);
      setMessages([]);
    } else {
      setSearchingUser(false);
    }
  }, [isChatActive]);

  // ********** Navigation Modal Functions ********** //

  const modalUserRatingClose = (val) => {
    setEndConfirm(true);
    setEndChat(true);
    window.location.reload();
  };

  // ********** My States End ********** //

  // Emoji Functionality
  const [messageValue, setMessageValue] = useState("");
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const lastMessageRef = useRef();
  const typingStatusRef = useRef();

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (messageValue !== "") {
      sendMessage(messageValue + (chosenEmoji ? chosenEmoji.native : ""));
      // Scroll to bottom with a small delay
      setTimeout(() => {
        scrollToBottom();
        scrollToBottomTyping();
      }, 100);
      setMessageValue("");
      setChosenEmoji(null);
    } else {
      // alert("Can't send empty message!");
      toast.error("Cannot send empty message!", {
        style: {
          borderRadius: '999px',
          background: '#333',
          color: '#fff',
        }
      });
    }
  };

  const messageListRef = useRef()
  const scrollToBottom = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight

    }
  }

  const scrollToBottomTyping = () => {
    if (typingStatusRef.current) {
      typingStatusRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }
  useEffect(() => {
    scrollToBottom();
    scrollToBottomTyping();
  }, [messages, otherUserTyping]);

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      document.getElementById("send_btn").click();
      setChosenEmoji(null);
    }
  }

  let prevLength = 0;

  function handleMessageChange(event) {
    const currentLength = event.target.value.length;
    if (typingUser === "typing") {
      if (currentLength === 1 && prevLength === 0) {
        sendTypingStatus();
      } else if (currentLength === 0) {
        sendNotTypingStatus();
      }
    }
    prevLength = currentLength;
    if (chosenEmoji && currentLength === 0) {
      setMessageValue("");
      setChosenEmoji(null);
    } else if (chosenEmoji && currentLength === 1) {
      setMessageValue(chosenEmoji.native);
      setChosenEmoji(null);
    } else {
      setMessageValue(event.target.value + (chosenEmoji ? chosenEmoji.native : ""));
    }
  }

  const emojiRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (emojiRef.current && !emojiRef.current.contains(event.target)) {
      setShowEmojiPicker(false);
    }
  };

  const toggleEmojiPicker = (event) => {
    event.stopPropagation();
    setShowEmojiPicker(!showEmojiPicker);
  }

  function handleInputFocus() {
    setTypingUser("typing");
    setChosenEmoji(null);
    console.log("Typing User Focus: ", typingUser)
  }

  function handleInputBlur() {
    setTypingUser("");
    setChosenEmoji(null)
    console.log("Typing User Blur: ", typingUser)
  }

  // ToolTip Functionality
  const [toolTipOpen, setToolTipOpen] = useState(false);
  const [toolTipOpen1, setToolTipOpen1] = useState(false)

  const toggleToolTip = () => {
    setToolTipOpen(!toolTipOpen)
  }
  const toggleToolTip1 = () => {
    setToolTipOpen1(!toolTipOpen1)
  }

  // Color Matcher
  function getMatchColor(percentMatch) {
    let color;
    if (percentMatch < 17) {
      // Shades of gray
      const grayValue = Math.round(percentMatch / 10 * 255);
      color = `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
    } else if (percentMatch < 33) {
      // Light blue
      const blueValue = Math.round((percentMatch - 10) / 20 * 255);
      color = `rgb(0, ${blueValue}, ${blueValue})`;
    } else if (percentMatch < 67) {
      // Shades of #1169d0
      const blueValue = Math.round((percentMatch - 30) / 40 * 255);
      color = `rgb(17, 105, ${blueValue})`;
    } else {
      // Shades of green
      const greenValue = Math.round((percentMatch - 70) / 30 * 255);
      color = `rgb(0, ${greenValue}, 0)`;
    }
    return color;
  }

  return (
    <div
      ref={messageListRef}
      className={
        requestToChat
          ? "chat_wrapper w-80"
          : searchingUser
            ? "chat_wrapper"
            : "chat_wrapper pt-0"
      }
    >
      {searchingUser ? (
        <div>
          <div>
            <Toaster position="top-right" />
          </div>
          <div className="random-stranger-div position-relative">
            <p>You're now chatting with a random stranger.</p>
          </div>
          <div className="rating-div text-center mt-4">
            <div>
              <p>
                <span style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: props.numConversations === 0 ? '#8d99ae' : getMatchColor(props.percentMatch)
                }}>
                  {Math.round(props.percentMatch)}
                </span>
                % match - <span style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: props.numConversations === 0 ? '#8d99ae' : 'rgba(17, 105, 208, 1)'
                }}>
                  {props.numConversations}
                </span> conversations
              </p>
            </div>
            <p
              className="connected-user-text text-center"
              style={{ opacity: connectText ? 1 : 0 }}
            >
              Connected to Stranger, say hi!
            </p>
          </div>
          <div className={newChat ? "chat-room" : "chat-room regular-chat"}>
            <ul className="messages-list">
              {messages?.map((message, index) => {
                return (
                  <li
                    className="d-flex align-items-end my-4"
                    ref={messages.length - 1 === index ? lastMessageRef : null}
                  >
                    <div className="user-detail position-relative cursor-pointer">
                      <span className="user-avatar d-block text-center">
                        <img
                          src={images.sender_icon}
                          alt="User Img"
                          className="img-fluid"
                        />
                        <p
                          className="text-muted"
                          style={{ fontSize: "0.8rem" }}
                        >
                          {typeof message === "object" ? "Stranger" : "You"}
                        </p>
                      </span>
                      {/* <div className="user-rating d-flex justify-content-between align-items-center position-absolute">
                        <div className="rating-div d-flex">
                          <span>
                            <i class="fa-solid fa-star"></i>
                          </span>
                          <span>
                            <i class="fa-solid fa-star"></i>
                          </span>
                          <span>
                            <i class="fa-solid fa-star"></i>
                          </span>
                          <span>
                            <i class="fa-solid fa-star"></i>
                          </span>
                          <span className="with-out-rating">
                            <i class="fa-regular fa-star"></i>
                          </span>
                        </div>
                        <span className="ms-2 rating-rate">4.2 (45)</span>
                      </div> */}
                    </div>
                    <div className="message-detail ms-3">
                      <span className="message-para d-block">
                        {typeof message === "object"
                          ? message.text
                          : message.slice(5)}
                      </span>
                      <span className="message-time text-end d-block">
                        {moment(message.timestamp).format("hh:mm A")}
                      </span>
                    </div>
                  </li>
                );
              })}
              {/* Typing Item */}
              {otherUserTyping && userStatus !== "disconnected" ? (
                <li className="scroll-up d-flex align-items-end my-4 pe-5">
                  <div className="user-detail position-relative ">
                    <span className="user-avatar d-block text-center">
                      <img
                        src={images.sender_icon}
                        className="img-fluid"
                        alt="User Alt"
                      />
                      <p className="text-muted" style={{ fontSize: "0.8rem" }}>
                        Stranger
                      </p>
                    </span>
                    <div className="user-rating d-flex justify-content-between align-items-center position-absolute">
                      <div className="rating-div d-flex">
                        <span>
                          <i class="fa-solid fa-star"></i>
                        </span>
                        <span>
                          <i class="fa-solid fa-star"></i>
                        </span>
                        <span>
                          <i class="fa-solid fa-star"></i>
                        </span>
                        <span>
                          <i class="fa-solid fa-star"></i>
                        </span>
                        <span className="with-out-rating">
                          <i class="fa-regular fa-star"></i>
                        </span>
                      </div>
                      <span className="ms-2 rating-rate">4.2 (45)</span>
                    </div>
                  </div>
                  <div className="typing-bubble ms-3">
                    <div class="typing">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </li>
              ) : (
                ""
              )}
              {/* Typing Item End */}
            </ul>
            {endConfirm && (
              <div className="disconnected-stranger mb-5">
                <button
                  className="btn btn-info bg-info px-3"
                  onClick={() => { onClickStartNewChatBtn(); setChatType("Text") }}
                >
                  New Chat
                </button>{" "}
                <span className="inter-600 ms-2 mr-2">or {"   "}</span>
                <Link
                  to={`/audio/${selectedGroup}`}
                  onClick={() => {
                    setChatType("Text")
                    handleAudioConnect(selectedGroup);
                    // navigate("/audio-chat",{replace:true, });
                  }}
                  className="btn px-3 py-2"
                  id="audio-switch-action"
                >
                  Switch to <span>Audio</span>
                </Link>
                {/* <Tooltip placement="top" isOpen={toolTipOpen1} target="audio-switch-action" toggle={toggleToolTip1}>
                  Available Soon!
                </Tooltip> */}
              </div>
            )}
          </div>
          {/* {endConfirm && (
            <div className="disconnected-stranger mb-4">
              <button
                className="btn btn-info bg-info px-3"
                onClick={onClickStartNewChatBtn}
              >
                New Chat
              </button>{" "}
              <span className="inter-600 ms-2 mr-2">or {"   "}</span>
              <Link
                // to="/audio-chat"
                className="btn px-3 py-2"
                id="audio-switch-action"
              >
                Switch to <span>Audio</span>
              </Link>
              <Tooltip placement="top" isOpen={toolTipOpen1} target="audio-switch-action" toggle={toggleToolTip1}>
                Available Soon!
              </Tooltip>
            </div>
          )} */}
          <div className="chat-room-footer d-flex align-items-center justify-content-between fixed-bottom py-3 px-4">
            {end ? (
              <div className="end-chat">
                {endConfirm ? (
                  <Button
                    color="info bg-info text-dark"
                    onClick={onClickStartNewChatBtn}
                  >
                    New Chat
                  </Button>
                ) : (
                  <Button className="rounded" onClick={onClickEndConfirmBtn}>
                    Confirm
                  </Button>
                )}
              </div>
            ) : (
              <div className="end-chat">
                <Button className="rounded" onClick={onClickEndBtn}>
                  End
                </Button>
              </div>
            )}
            <div
              className={
                isChatActive
                  ? "type-message-div d-flex align-items-center rounded justify-space-between w-80"
                  : "type-message-div d-flex align-items-center rounded justify-space-between"
              }

            >
              <div className="emoji-div">
                <img src={images.emoji_icon} alt="Emoji" onClick={toggleEmojiPicker} />
              </div>
              {showEmojiPicker && (
                <div style={{ position: 'absolute', bottom: 80, left: 20 }} ref={emojiRef}>
                  <Picker
                    onEmojiSelect={(emoji) => {
                      setChosenEmoji(emoji);
                      setMessageValue((messageValue || "") + emoji.native);
                    }}
                    data={data}
                  />
                </div>
              )}
              <input
                placeholder="Write Here Something..."
                value={messageValue}
                type="text"
                onKeyDown={handleKeyDown}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onChange={userStatus !== "disconnected" ? handleMessageChange : null}
              />
              <div className="voice-msg-div">
                {/* <img src={images.voice_icon} alt="Microphone" /> */}
                <i class="fa-solid fa-microphone img" id="voice-msg"></i>
              </div>
            </div>
            <div
              className={
                requestToChat
                  ? "send-message w-12"
                  : newChat
                    ? "send-message disable"
                    : "send-message"
              }
              style={{ opacity: newChat && "0.5" }}
            >
              <button
                className={
                  requestToChat ? "ps-4 text-start rounded" : "rounded"
                }
                id="send_btn"
                type="button"
                onClick={handleSendMessage}
                disabled={userStatus === "disconnected" ? true : false}
              >
                Send
              </button>
            </div>
          </div>
          {ratingPopup ? (
            <EndChatModal
              user={user}
              asRef={ref}
              setRatingModal={setRatingPopup}
              modalUserRatingClose={modalUserRatingClose}
              loginHandler={loginHandler}
              registerHandler={registerHandler}
              userIdentify={userIdentify}
              starRating={starRating}
              setStarRating={setStarRating}
              sendStarRating={sendStarRating}
            />
          ) : (
            ""
          )}
        </div>
      ) : (
        <div>
          <SearchUser
            userIdentify={userIdentify}
            handleConnect={handleConnect}
            loginHandler={loginHandler}
            registerHandler={registerHandler}
            userToken={userToken}
            setUserToken={setUserToken}
          />
        </div>
      )}
    </div>
  );
};
export default ChatScreen;
