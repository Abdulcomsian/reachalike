import React from "react";
import images from "../../constant/images/index";
import "./style.css";

const Header = (props) => {
    const { loginHandler, registerHandler, nearMeHandler } = props;
    return (
        <nav class="navbar navbar-expand-lg navbar-light main-header">
            <div class="container-fluid">
                <span className="common-btn-link rounded cursor-pointer" onClick={nearMeHandler}>
                    <a>near me</a>
                </span>
                <ul class="navbar-nav m-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="logo nav-link active position-absolute" aria-current="page" href="#">
                            <img src={images.logo} className="img-fluid" />
                        </a>
                    </li>
                </ul>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse justify-content-between" id="navbarTogglerDemo03">
                    <ul class="navbar-nav mr-auto mb-2 mb-lg-0 ms-1">
                        <li class="nav-item dropdown">
                            <a class="common-btn-link dropdown-toggle rounded cursor-pointer" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Groups
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a class="dropdown-item" href="#">Lifestyle</a></li>
                                <li><a class="dropdown-item" href="#">Enterprenuership</a></li>
                                <li><a class="dropdown-item" href="#">Business</a></li>
                                <li><a class="dropdown-item" href="#">Entertainment</a></li>
                                <li><a class="dropdown-item" href="#">Education</a></li>
                            </ul>
                        </li>
                    </ul>
                    <ul class="navbar-nav ml-auto mb-2 mb-lg-0 auth-list">
                        <li class="nav-item me-2">
                            <a class="nav-link rounded" aria-current="page" onClick={loginHandler}>Login</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active rounded" aria-current="page" onClick={registerHandler}>Register</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
export default Header;