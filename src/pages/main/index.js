import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import images from "../../constant/images";
import { Link } from "react-router-dom";
import ConfrormationModal from "../../modal/confromationModal";
import { Tooltip } from "reactstrap";

const MainScreen = (props) => {
  const ref = useRef();
  const [conformationModal, setConformationModal] = useState(false);
  const [chatType, setChatType] = useState(null);

  const [toolTipOpen, setToolTipOpen] = useState(false);
  const toggleToolTip = () => {
    setToolTipOpen(!toolTipOpen)
  }

  const { handleConnect, messages, setMessages } = props;

  const conformationTextHandler = () => {
    setConformationModal(true);
    setChatType("Text");
    setMessages("");
    // props.setRatingPopup(true);
    // props.onClickStartNewChatBtn();
  };

  const conformationAudioHandler = () => {
    setConformationModal(true);
    setChatType("Audio");
  };

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (conformationModal && ref.current && !ref.current.contains(e.target)) {
        setConformationModal(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [conformationModal]);

  return (
    <>
      <div className="main-div d-flex align-items-center justify-content-center position-relative">
        <div className="px-3">
          <p className="text-center">
            {/* Great way to <span className="fw-bold">meet new friends</span>, even
            while practicing social distancing. When you use{" "}
            <span className="logo-text fw-bold">
              <span style={{ color: "rgba(33, 68, 143, 1)" }}>Reach</span>
              <span style={{ color: "rgba(55, 193, 240, 1)" }}>Alike</span>
            </span> */}
            Audio call with strangers like you. Let <span style={{ color: "rgba(33, 68, 143, 1)", fontWeight: "600" }}>Machine</span> <span style={{ color: "rgba(55, 193, 240, 1)", fontWeight: "600" }}>Learning</span> find the best matches for you !
          </p>
          <div className="audio-chat-functionality-div rounded">
            <div className="btn-group d-flex justify-content-between">
              <a
                className="text d-flex align-items-center justify-content-between"
                onClick={conformationTextHandler}
              >
                <span className="ps-3">
                  <img src={images.T_icon} className="img-fluid" />
                </span>
                <span>text</span>
                <span className="icon-span">
                  <i class="fa-solid fa-arrow-right"></i>
                </span>
              </a>
              <a
                className="audio d-flex align-items-center justify-content-between"
                // onClick={conformationAudioHandler}
                id="audio-switch-action"
              >
                <span className="ps-3">
                  <img src={images.audio_icon} className="img-fluid" />
                </span>
                <span>audio</span>
                <span className="icon-span">
                  <i class="fa-solid fa-arrow-right"></i>
                </span>
                <Tooltip placement="right" isOpen={toolTipOpen} target="audio-switch-action" toggle={toggleToolTip}>
                  Available Soon!
                </Tooltip>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-widget position-absolute bottom-0">
          <p className="text-center buy-me-coffee">
            Buy me a Coffee?{" "}
            <a href="https://www.buymeacoffee.com" target="_blank">
              <i class="fa-solid fa-mug-saucer"></i>
            </a>
          </p>
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
          <p className="text-center">
            © 2022<a> Reachalike</a>.All rights reserved.
            <br />
            {/* Like the website ? Support me so that I can advertise for it and
            bring other awesome people to talk to. */}
          </p>
        </div>
      </div>
      {conformationModal && (
        <ConfrormationModal
          handleConnect={handleConnect}
          chatType={chatType}
          asRef={ref}
        />
      )}
    </>
  );
};

export default MainScreen;
