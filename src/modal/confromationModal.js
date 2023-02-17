import React, { useState, useEffect } from "react";
import "./style.css";
import { Link, useNavigate } from "react-router-dom";

const ConfromationModal = (props) => {
  const { handleConnect, asRef, chatType, isChatActive } = props
  const [confoamtionBtn, setConformationBtn] = useState(false);
  const [checkedOurAge, setCheckedOurAge] = useState(false);
  const [checkedTermCondtion, setCheckedTermCondtion] = useState(false);

  const navigate = useNavigate()

  const handleChat = () => {
    handleConnect()
    navigate("/chat")
    // if (isChatActive) {
    // }
    // else {
    //   navigate("/")
    // }
  }

  const handleAudioChat = () => {
    navigate("/audio-chat")
  }

  const ourAgeHandler = () => {
    setCheckedOurAge(!checkedOurAge);
  };

  const ourTermConditionHandler = () => {
    setCheckedTermCondtion(!checkedTermCondtion);
  };

  useEffect(() => {
    if (checkedOurAge && checkedTermCondtion) {
      setConformationBtn(true);
    } else {
      setConformationBtn(false);
    }
  }, [checkedOurAge, checkedTermCondtion]);

  return (
    <div className="common-wrapper d-flex align-items-center justify-content-center position-absolute">
      <div className="conformation-box" ref={asRef}>
        <div className="form-check mb-3 mt-3">
          <input
            type="checkbox"
            className="form-check-input"
            onChange={ourAgeHandler}
            id="age-check"
          />
          <label className="form-check-label" for="age-check">
            <b>
              OUR AGE RESTRICTIONS HAVE CHANGED. YOU MUST BE 18 OR OLDER TO USE
              REACH ALIKE.
            </b>{" "}
            Persons under the age of 18 may not use Reach Alike. See our updated
            Terms of Service for more info.{" "}
            <b>
              By checking the box you acknowledge and represent that you comply
              with these age restrictions.
            </b>
          </label>
        </div>
        <div className="checkbox-input form-check mb-4 mt-2">
          <input
            type="checkbox"
            className="form-check-input"
            onChange={ourTermConditionHandler}
            id="privacy-check"
          />
          <label className="form-check-label" for="privacy-check">
            By checking the box you acknowledge that you have reviewed and agree
            to be bound by Reach Alike Terms of Service, Privacy Policy, and
            Community Guidelines.
          </label>
        </div>
        {
          chatType == "Text" ?
            <button
              className="confirm-btn rounded"
              style={{
                opacity: confoamtionBtn ? 1 : 0.5,
                pointerEvents: confoamtionBtn ? "all" : "none",
              }}
              onClick={handleChat}
            >Confirm & Continue</button>
            :
            <button
              onClick={handleAudioChat}
              className="confirm-btn rounded"
              style={{
                opacity: confoamtionBtn ? 1 : 0.5,
                pointerEvents: confoamtionBtn ? "all" : "none",
              }}
            >Confirm & Continue</button>
        }
      </div>
    </div>
  );
};
export default ConfromationModal;
