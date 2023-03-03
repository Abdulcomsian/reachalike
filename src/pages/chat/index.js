import React, { useState, useEffect, useRef, useCallback } from "react";
import "./style.css";
import images from "../../constant/images";
import SearchUser from "../../layouts/search-user";
import { Link } from "react-router-dom";
import EndChatModal from "../../components/EndChat/ConfirmationModal";
import moment from "moment/moment";
import { Button } from "reactstrap";

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
  } = props;

  const [newChat, setNewChat] = useState(false);
  const [connectText, setConnectText] = useState(true);

  // ********** My States ********** //

  // ********** UseEffect Running on Mount ********** //
  useEffect(() => {
    if (userStatus === "disconnected") {
      // onClickEndConfirmBtn();
      onClickConfirm();
      setMessages([]);
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

  const lastMessageRef = useRef();
  const messageRef = useRef();

  const handleSendMessage = (event) => {
    event.preventDefault();
    const input = messageRef.current;
    if (input.value !== "") {
      sendMessage(input.value);
      input.value = "";
    } else {
      alert("Can't send empty message!");
    }
  };

  const scrollToBottom = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      document.getElementById("send_btn").click();
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
  }

  function handleInputFocus() {
    setTypingUser("typing");
    console.log("Typing User Focus: ", typingUser)
  }

  function handleInputBlur() {
    setTypingUser("");
    console.log("Typing User Blur: ", typingUser)
  }




  return (
    <div
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
          <div className="random-stranger-div position-relative">
            <p>You're now chatting with a random stranger.</p>
          </div>
          <div className="rating-div text-center mt-4">
            <div>
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
                <li className="d-flex align-items-end my-4">
                  <div className="user-detail position-relative cursor-pointer">
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
          </div>
          {endConfirm && (
            <div className="disconnected-stranger mb-4">
              <p className="inter-600">{userIdentify ? "You have disconnected" : "Stranger has disconnected."}</p>
              <button
                className="btn btn-info bg-info px-3"
                onClick={onClickStartNewChatBtn}
              >
                New Chat
              </button>{" "}
              <span className="inter-600 ms-2 mr-2">or {"   "}</span>
              <Link
                to="/audio-chat"
                className="btn btn-primary bg-primary px-3 py-2"
              >
                Switch to <span>Audio</span>
              </Link>
            </div>
          )}
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
                <img src={images.emoji_icon} alt="Emoji" />
              </div>
              <input
                placeholder="Write Here Something..."
                name="message"
                type="text"
                ref={messageRef}
                onKeyDown={handleKeyDown}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onChange={userStatus !== "disconnected" ? handleMessageChange : null}
              />
              <div className="voice-msg-div">
                <img src={images.voice_icon} alt="Microphone" />
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
              loginHandler={props.loginHandler}
              registerHandler={props.registerHandler}
            />
          ) : (
            ""
          )}
        </div>
      ) : (
        <div>
          <SearchUser handleConnect={handleConnect} />
        </div>
      )}
    </div>
  );
};
export default ChatScreen;
