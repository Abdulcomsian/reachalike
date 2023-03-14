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

const RatingChat = (props) => {
  const { asRef, user, starRating, userIdentify, setStarRating, sendStarRating } = props;
  const [ratingValue, setRatingValue] = useState(0);

  const navigate = useNavigate();

  const handleRating = (rate) => {
    setRatingValue(rate);
    setStarRating(rate);
  };

  const location = useLocation();

  const submitRatingValue = (ratingValue) => {
    setStarRating(ratingValue);
    sendStarRating();
    props.setRatingModal(false);
    navigate("/");
  };

  return (
    <div className="common-wrapper d-flex align-items-center justify-content-center position-absolute">
      <div className="chat-rating-div" ref={asRef}>
        <p style={{ color: "#bf0603", marginBottom: '0.5rem' }} className="inter-600">{userIdentify ? "You have disconnected" : "Stranger has disconnected."}</p>
        <h5>Rate User!</h5>
        <p>Click on a star to rate it!</p>
        {/* {user !== null || user !== "" ? (
          <>
            <p style={{ fontSize: "0.8rem" }} className="text-danger">
              You are not connected, please
            </p>
            <button
              style={{ fontSize: "0.9rem", fontWeight: "600" }}
              className="btn btn-sm my-1 btn-primary"
              onClick={props.loginHandler}
            >
              Login
            </button>
            <p style={{ fontSize: "0.8rem" }} className="text-danger">
              or
            </p>
            <button
              style={{ fontSize: "0.9rem", fontWeight: "600" }}
              className="btn btn-sm my-1 btn-warning"
              onClick={props.registerHandler}
            >
              Register
            </button>
            <p style={{ fontSize: "0.8rem" }} className="text-danger">
              for better matches
            </p>
          </>
        ) : (
          ""
        )} */}
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
export default RatingChat;
