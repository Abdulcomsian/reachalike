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
  const { asRef, user, starRating, setStarRating, sendStarRating } = props;
  const [ratingValue, setRatingValue] = useState(0);

  const navigate = useNavigate();

  const handleRating = (rate) => {
    setRatingValue(rate);
    setStarRating(rate);
  };

  const location = useLocation();

  const submitRatingValue = (ratingValue) => {
    // event.preventDefault();
    setStarRating(ratingValue);
    sendStarRating();
    props.setRatingModal(false);
  };
  console.log(ratingValue);
  return (
    <div className="common-wrapper d-flex align-items-center justify-content-center position-absolute">
      <div className="chat-rating-div" ref={asRef}>
        <p style={{ color: "#bf0603", marginBottom: '0.5rem' }} className="inter-600">{props.userIdentify ? "You have disconnected" : "Stranger has disconnected."}</p>
        <h5>Rate User!</h5>
        <p>Click on a star to rate it!</p>
        <div className="rating-div text-center mt-3">
          <div>
            <Rating
              tooltipArray={tooltipArray}
              size={50}
              transition
              allowFraction
              onClick={handleRating}
              ratingValue={ratingValue}
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
