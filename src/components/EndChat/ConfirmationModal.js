import React, { useState } from "react";
import "./style.css";
import { Rating } from "react-simple-star-rating";
import { Button } from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";

const tooltipArray = [
  "Terrible",
  "Terrible+",
  "Bad",
  "Bad+",
  "Average",
  "Average+",
  "Great",
  "Great+",
  "Awesome",
  "Awesome+",
];

const EndChatModal = (props) => {
  const { asRef, user } = props;
  const [ratingValue, setRatingValue] = useState(0);

  const navigate = useNavigate();

  const handleRating = (rate) => {
    setRatingValue(rate);
  };

  const location = useLocation();

  const submitRatingValue = (rate) => {
    props.setRatingModal(false);
    // props.submitEndChat(false);
    // props.modalUserRatingClose();
    // props.setEndChat(false);
    // navigate("/");
  };
  console.log(ratingValue);
  return (
    <div className="common-wrapper d-flex align-items-center justify-content-center position-absolute">
      {/* onClick={modalUserRatingClose} */}
      <div className="chat-rating-div" ref={asRef}>
        <h5>Rate User!</h5>
        <p>Click on a star to rate it!</p>
        {user !== null || user !== "" ? (
          <p style={{ fontSize: "0.8rem" }} className="text-danger">
            You are not connected, please login or register for better matches
          </p>
        ) : (
          ""
        )}
        <div className="rating-div text-center mt-3">
          <div>
            <Rating
              tooltipArray={tooltipArray}
              size={50}
              transition
              allowFraction
              onClick={handleRating}
            />
            <Button
              className={ratingValue === 0 ? "disabled mt-4" : "btn-info mt-4"}
              onClick={submitRatingValue}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EndChatModal;
