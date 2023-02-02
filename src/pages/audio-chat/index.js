import React, { useState, useEffect, useRef } from "react";
import SearchUser from "../../layouts/search-user";
import "./style.css";
import images from "../../constant/images";
import ChatScreen from "../chat";

const AudioChat = () => {
    const [findUser, setFindUser] = useState(false);
    const [endChat, setEndChat] = useState(false);
    const [mute, setMute] = useState(false);
    const [startChat, setStartChat] = useState(false);
    const [requestToChat, setRequestToChat] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setFindUser(true)
        }, 10000);
    }, [findUser]);
    return (
        <>
            <div className={startChat && "d-flex"}>
                <div className={startChat ? "audio_chat_wrapper w-40" : "audio_chat_wrapper"}>
                    {findUser ? (
                        <>
                            <div className={startChat ? "audio-body flex-column d-flex h-100" : "audio-body d-flex  h-100"}>
                                <div className={startChat ? "audio-body-left w-100 d-flex align-items-center justify-content-center" : !endChat ? "audio-body-left d-flex align-items-center justify-content-center" : "audio-body-left w-100 d-flex align-items-center justify-content-center"}>
                                    <div className="common-audio">
                                        <img src={images.audio_one} className="img-fluid" />
                                    </div>
                                </div>
                                {!endChat && <> <div className={startChat ? "spacer-column" : "spacer"}></div>
                                    <div className={startChat ? "audio-body-right w-100 d-flex align-items-center justify-content-center" : "audio-body-right d-flex align-items-center justify-content-center"}>
                                        <div className="common-audio">
                                            <img src={images.audio_two} className="img-fluid" />
                                        </div>
                                    </div></>}

                            </div>
                            <div className="audio-footer d-flex align-items-center justify-content-center flex-column">
                                {endChat ? <> <p className="stranger-disconnected">Stranger has disconnected.</p>
                                    <div className="footer-button">
                                        <button className="inter-600 rounded border-0" onClick={() => [setFindUser(false), setEndChat(false)]}>New Audio Chat</button> <span className="inter-600 ms-2">or switch to <span>Text</span></span>
                                        <span></span>
                                    </div></> : <div className="footer-button-group">
                                    <button className="common-footer-btn end-call-btn" onClick={() => setEndChat(true)}>
                                        <img src={images.call_end} />
                                    </button>
                                    <button className="common-footer-btn" onClick={() => setMute(!mute)}>
                                        <i class={mute ? "fa-solid fa-microphone-slash" : "fa-solid fa-microphone"}></i>
                                    </button>
                                    <button className="common-footer-btn" onClick={() => setStartChat(!startChat)}>
                                        <i class="fa-solid fa-envelope"></i>
                                    </button>
                                </div>}


                            </div>
                        </>
                    ) : (
                        <div><SearchUser /></div>
                    )}
                </div>
                {startChat && <ChatScreen requestToChat={requestToChat} />}
            </div>
        </>
    )
}
export default AudioChat;