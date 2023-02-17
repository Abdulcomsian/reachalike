import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import images from "../../constant/images";
import SearchUser from "../../layouts/search-user";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Link } from "react-router-dom";
import EndChatModal from "../../components/EndChat/ConfirmationModal";

const ChatScreen = (props) => {
  const ref = useRef();
  const {
    messages,
    isChatActive,
    handleConnect,
    connectedText,
    connectToUser,
    requestToChat,
    user,
    findUser,
    setFindUser,
    endChat,
    setEndChat,
    sendMessage,
    closeConnection
  } = props;


  const [newChat, setNewChat] = useState(false);
  const [connectText, setConnectText] = useState(true);
  const [confirm, setConfirm] = useState(false);
  const [yes, setYes] = useState(false);
  const [ratingModal, setRatingModal] = useState(false);

  const onClickYes = () => {
    setYes(true);
  };

  const onClickConfirm = () => {
    setEndChat(true);
    setNewChat(true);
    closeConnection();
    setRatingModal(true);
  };

  const onClickNewChat = () => {
    handleConnect();
    setFindUser(false)
    setNewChat(false)
    setYes(false)
    setConfirm(false)
  }

  const toggleModal = () => setConfirm(!confirm);

  const onClickEnd = () => {
    setYes(true);
  }

  useEffect(() => {
    if (requestToChat) {
      setFindUser(true);
    } else {
      setTimeout(() => {
        setFindUser(true);
      }, 10000);
    }
    if (findUser) {
      setTimeout(() => {
        setConnectText(false);
      }, 3000);
    }
    const checkIfClickedOutside = (e) => {
      if (endChat && ref.current && !ref.current.contains(e.target)) {
        setEndChat(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [findUser, endChat]);

  const modalUserRatingClose = (val) => {
    setEndChat(true);
  };

  const lastMessageRef = useRef()
  const messageRef = useRef()
  const handleSendMessage = (event) => {
    event.preventDefault();
    const input = messageRef.current;
    sendMessage(input.value);
    input.value = "";
    lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
  }

  // const onConnectionEstablish = () => {
  //   connectToUser();
  //   if (connectedText) {
  //     sendMessage()
  //   }
  // }

  return (
    <div
      className={
        requestToChat
          ? "chat_wrapper w-80"
          : isChatActive
            ? "chat_wrapper"
            : "chat_wrapper pt-0"
      }
    >
      {isChatActive ? (
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
            <ul>
              {
                messages?.map((message, index) => (

                  <li className="d-flex my-3" ref={messages.length - 1 === index ? lastMessageRef : null}>
                    <div className="user-detail position-relative cursor-pointer">
                      <span className="user-avatar d-block text-center">
                        <img src={images.sender_icon} className="img-fluid" />
                      </span>
                      <span className="indentifier text-center">You</span>
                      <div className="user-rating d-flex justify-content-between  position-absolute">
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
                    <div className="message-detail ms-2">
                      <span className="message-para d-block">
                        {message}
                      </span>
                      <span className="message-time text-end d-block">23:00</span>
                    </div>
                  </li>
                ))
              }
            </ul>
          </div>

          {newChat && (
            <div className="disconnected-stranger mb-4">
              <p className="inter-600">Stranger has disconnected.</p>
              <button
                className="btn btn-info bg-info px-3"
                onClick={() => [setFindUser(false), setNewChat(false), handleConnect()]}
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

          <div className="chat-room-footer d-flex align-item-center justify-content-between fixed-bottom py-3 px-4">
            {
              yes ?
                <div className="end-chat">
                  {
                    newChat ?
                      <Button
                        color="info bg-info text-dark"
                        onClick={onClickNewChat}
                      >
                        New Chat
                      </Button>
                      :
                      <Button
                        className="rounded"
                        onClick={onClickConfirm}
                      >
                        Confirm
                      </Button>
                  }
                </div>
                :
                <div className="end-chat">
                  <Button className="rounded" onClick={onClickEnd}>
                    End
                  </Button>
                </div>
            }
            {/* End Chat Modal */}
            <Modal isOpen={confirm} toggle={toggleModal}>
              <ModalHeader toggle={toggleModal}>Confirmation</ModalHeader>
              <ModalBody>
                Are you sure you want to leave this converstion?
              </ModalBody>
              <ModalFooter>
                <Button
                  color={yes ? "danger" : "warning"}
                  className="px-4"
                  onClick={yes ? onClickConfirm : onClickYes}
                >
                  {yes ? "Confirm" : "Yes"}
                </Button>{" "}
                <Button color="success" className="px-4" onClick={toggleModal}>
                  No
                </Button>
              </ModalFooter>
            </Modal>
            {/* End Chat Modal End */}
            <div
              className={
                requestToChat
                  ? "type-message-div d-flex align-item-center rounded justify-space-between w-80"
                  : "type-message-div d-flex align-item-center rounded justify-space-between"
              }
            >
              <div className="emoji-div">
                <img src={images.emoji_icon} />
              </div>
              <input placeholder="Write Here Something..." name="message" type="text" ref={messageRef} />
              <div className="voice-msg-div">
                <img src={images.voice_icon} />
                {/* <i class="fa-solid fa-microphone"></i> */}
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
                type="button"
                onClick={handleSendMessage}
              >
                Send{" "}<i class="fa-solid fa-paper-plane"></i>
                {/* <span>
                  <img src={images.send_icon} />
                </span> */}
              </button>
            </div>
          </div>
          {ratingModal && (
            <EndChatModal
              user={user}
              asRef={ref}
              setRatingModal={setRatingModal}
              modalUserRatingClose={modalUserRatingClose}
              loginHandler={props.loginHandler}
              registerHandler={props.registerHandler}
            />
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
