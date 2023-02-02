import React, { useState } from "react";
import "./style.css";
import { Rating } from 'react-simple-star-rating';
import RatingComponent from '@cogent-labs/react-rating-component';

const RatingChat = (props) => {
    const { asRef } = props;
    const [ratingValue, setRatingValue] = useState(0)

    const handleRating = (rate) => {
        setRatingValue(rate);
    }
    console.log(ratingValue)
    return (
        <div className="common-wrapper d-flex align-items-center justify-content-center position-absolute">
            {/* onClick={modalUserRatingClose} */}
            <div className="chat-rating-div" ref={asRef}>
                <h5>Rate User!</h5>
                <p>Click on a star to rate it!</p>
                <div className="rating-div text-center mt-3">
                    <div>
                        <Rating
                            tooltipArray={['Terrible', 'Bad', 'Average', 'Great', 'Prefect']}
                            onClick={handleRating}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default RatingChat;