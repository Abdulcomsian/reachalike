import React from "react";
import Lottie from 'react-lottie';
import loader from "../../constant/lottie/lesson 3.json";
import images from "../../constant/images";
import "./style.css";

const SearchUser = ({ handleConnect }) => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: loader,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };
    return (
        <div className="search-user-wrapper text-center">
            <div className="loader-div">
                <Lottie
                    options={defaultOptions}
                    height={200}
                    width={200}
                />
            </div>
            <div className="connecting-logo-div">
                <p className="fw-bold my-3">Connecting . . .</p>
                <span className="d-block">OR</span>
                <button onClick={handleConnect} className="rounded mt-2">Connect Randomly</button>
            </div>
        </div>
    )
}
export default SearchUser;