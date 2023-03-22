import React from 'react'
import { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Container } from 'reactstrap'
import images from '../../constant/images';
import './newchat.css'

const NewChat = (props) => {
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
        sendStarRating
    } = props;

    const [newChat, setNewChat] = useState(false);
    const [connectText, setConnectText] = useState(true);

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
            alert("Can't send empty message!");
        }
    };

    const scrollToBottom = () => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
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
        if (percentMatch < 10) {
            // Shades of gray
            const grayValue = Math.round(percentMatch / 10 * 255);
            color = `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
        } else if (percentMatch < 30) {
            // Light blue
            const blueValue = Math.round((percentMatch - 10) / 20 * 255);
            color = `rgb(0, ${blueValue}, ${blueValue})`;
        } else if (percentMatch < 70) {
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
        <>
            <div className='chat__wrapper'>
                <div className='chat__body'>
                    <ul className='chat__list'>
                        <li className='chat__item'>
                            <div className='user__bubble d-block text-center'>
                                <img src={images.sender_icon} className="img-fluid" alt='User Image' />
                                <p>Stranger</p>
                            </div>
                            <div className='message__bubble'>
                                <p>Hi There!</p>
                            </div>
                        </li>
                        <li className='chat__item'>
                            <div className='user__bubble d-block text-center'>
                                <img src={images.sender_icon} className="img-fluid" alt='User Image' />
                                <p>Stranger</p>
                            </div>
                            <div className='message__bubble'>
                                <p>Hi There!</p>
                            </div>
                        </li>
                        <li className='chat__item'>
                            <div className='user__bubble d-block text-center'>
                                <img src={images.sender_icon} className="img-fluid" alt='User Image' />
                                <p>Stranger</p>
                            </div>
                            <div className='message__bubble'>
                                <p>Hi There!</p>
                            </div>
                        </li>
                        <li className='chat__item'>
                            <div className='user__bubble d-block text-center'>
                                <img src={images.sender_icon} className="img-fluid" alt='User Image' />
                                <p>Stranger</p>
                            </div>
                            <div className='message__bubble'>
                                <p>Hi There!</p>
                            </div>
                        </li>
                        <li className='chat__item'>
                            <div className='user__bubble d-block text-center'>
                                <img src={images.sender_icon} className="img-fluid" alt='User Image' />
                                <p>Stranger</p>
                            </div>
                            <div className='message__bubble'>
                                <p>Hi There!</p>
                            </div>
                        </li>
                        <li className='chat__item'>
                            <div className='user__bubble d-block text-center'>
                                <img src={images.sender_icon} className="img-fluid" alt='User Image' />
                                <p>Stranger</p>
                            </div>
                            <div className='message__bubble'>
                                <p>Hi There!</p>
                            </div>
                        </li>
                        <li className='chat__item'>
                            <div className='user__bubble d-block text-center'>
                                <img src={images.sender_icon} className="img-fluid" alt='User Image' />
                                <p>Stranger</p>
                            </div>
                            <div className='message__bubble'>
                                <p>Hi There!</p>
                            </div>
                        </li>
                        <li className='chat__item'>
                            <div className='user__bubble d-block text-center'>
                                <img src={images.sender_icon} className="img-fluid" alt='User Image' />
                                <p>Stranger</p>
                            </div>
                            <div className='message__bubble'>
                                <p>Hi There!</p>
                            </div>
                        </li>
                        <li className='chat__item'>
                            <div className='user__bubble d-block text-center'>
                                <img src={images.sender_icon} className="img-fluid" alt='User Image' />
                                <p>Stranger</p>
                            </div>
                            <div className='message__bubble'>
                                <p>Hi There!</p>
                            </div>
                        </li>
                        <li className='chat__item'>
                            <div className='user__bubble d-block text-center'>
                                <img src={images.sender_icon} className="img-fluid" alt='User Image' />
                                <p>Stranger</p>
                            </div>
                            <div className='message__bubble'>
                                <p>Hi There!</p>
                            </div>
                        </li>
                        <li className='chat__item'>
                            <div className='user__bubble d-block text-center'>
                                <img src={images.sender_icon} className="img-fluid" alt='User Image' />
                                <p>Stranger</p>
                            </div>
                            <div className='message__bubble'>
                                <p>Hi There!</p>
                            </div>
                        </li>
                        <li className='chat__item'>
                            <div className='user__bubble d-block text-center'>
                                <img src={images.sender_icon} className="img-fluid" alt='User Image' />
                                <p>Stranger</p>
                            </div>
                            <div className='message__bubble'>
                                <p>Hi There!</p>
                            </div>
                        </li>
                        <li className='chat__item'>
                            <div className='user__bubble d-block text-center'>
                                <img src={images.sender_icon} className="img-fluid" alt='User Image' />
                                <p>Stranger</p>
                            </div>
                            <div className='message__bubble'>
                                <p>Hi There!</p>
                            </div>
                        </li>
                        <li className='chat__item'>
                            <div className='user__bubble d-block text-center'>
                                <img src={images.sender_icon} className="img-fluid" alt='User Image' />
                                <p>Stranger</p>
                            </div>
                            <div className='message__bubble'>
                                <p>Hi There!</p>
                            </div>
                        </li>

                    </ul>
                    <div className='chat__input'>
                        <input
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            className='input__field'
                            type='text'
                            placeholder='Your Message here...'
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default NewChat;