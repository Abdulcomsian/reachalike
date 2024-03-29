import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import images from "../../constant/images";
import { Link } from "react-router-dom";
import ConfrormationModal from '../../modal/confromationModal'

const MainScreen = (props) => {
    const ref = useRef();
    const [conformationModal, setConformationModal] = useState(false);
    const [chatType, setChatType] = useState(null);
    
    const conformationTextHandler = () => {
        setConformationModal(true);
        setChatType("Text");
    }
    const conformationAudioHandler = () => {
        setConformationModal(true);
        setChatType("Audio");
    }
    useEffect(() => {
        const checkIfClickedOutside = e => {
            if (conformationModal && ref.current && !ref.current.contains(e.target)) {
                setConformationModal(false)
            }
        }
        document.addEventListener("mousedown", checkIfClickedOutside)
        return () => {
            document.removeEventListener("mousedown", checkIfClickedOutside)
        }
    }, [conformationModal])

    return (
        <>
            <div className="main-div d-flex align-items-center justify-content-center position-relative">
                <div className="px-3">
                    <p className="text-center">Great way to <span className="fw-bold">meet new friends</span>, even while practicing social distancing. When you use <span className="logo-text fw-bold"><span style={{ color: "rgba(33, 68, 143, 1)" }}>Reach</span><span style={{ color: "rgba(55, 193, 240, 1)" }}>Alike</span></span></p>
                    <div className="audio-chat-functionality-div rounded">
                        <div className="btn-group d-flex justify-content-between">
                            <a className="text d-flex align-items-center justify-content-between" onClick={conformationTextHandler}>
                                <span className="ps-3"><img src={images.T_icon} className="img-fluid" /></span>
                                <span>text</span>
                                <span className="icon-span"><i class="fa-solid fa-arrow-right"></i></span>
                            </a>
                            <a className="audio d-flex align-items-center justify-content-between" onClick={conformationAudioHandler}>
                                <span className="ps-3"><img src={images.audio_icon} className="img-fluid" /></span>
                                <span>audio</span>
                                <span className="icon-span"><i class="fa-solid fa-arrow-right"></i></span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="footer-widget position-absolute bottom-0">
                    <ul className="mb-2 p-0">
                        <li className="p-0">
                            <Link to="/term-condition">
                                <a>Terms & Conditions</a>
                            </Link>
                        </li>
                        <li>
                            <a>Cookies</a>
                        </li>
                        <li>
                            <Link to="/policy">
                                <a>Privacy Policy</a>
                            </Link>
                        </li>
                    </ul>
                    <p className="text-center">© 2022<a> Reachalike</a>.All rights reserved.</p>
                </div>

            </div>
            {conformationModal && <ConfrormationModal chatType={chatType} asRef={ref} />}
        </>
    )
}

export default MainScreen;