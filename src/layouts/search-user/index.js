import React from "react";
import Lottie from 'react-lottie';
import loader from "../../constant/lottie/lesson 3.json";
import "./style.css";
import buyCoffee from '../../assets/img/buycoffee.jpg'

const SearchUser = (props) => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: loader,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };
    const { handleConnect } = props;
    return (
        <div className="search-user-wrapper text-center">
            <p className="connection-login-message">You are not connected, please <button onClick={props.loginHandler}>Login</button> or <button onClick={props.registerHandler}>Register</button> for better matches!</p>
            <div className="loader-div">
                <Lottie
                    options={defaultOptions}
                    height={200}
                    width={200}
                />
            </div>
            <div className="connecting-logo-div">
                <p className="fw-bold my-3">Connecting . . .</p>
                {/* <span className="d-block">OR</span> */}
                {/* <button onClick={handleConnect} className="rounded mt-2">Connect Randomly</button> */}
                <p className="like-text"><b>Like the website?</b> Support me so that I can advertise for it and bring other awesome people to talk to</p>
                <p className="text-center buy-me-coffee">
                    {/* Buy me a Coffee?{" "} */}
                    <a href="https://www.buymeacoffee.com" target="_blank">
                        {/* <i class="fa-solid fa-mug-saucer"></i> */}
                        <img src={buyCoffee} width="200px" height="auto" />
                    </a>
                </p>

            </div>
        </div>
    )
}
export default SearchUser;