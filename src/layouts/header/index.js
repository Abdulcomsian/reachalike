import React from "react";
import images from "../../constant/images/index";
import logo from "../../assets/img/logo.svg";
import "./style.css";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import ConfirmationModal from "../../components/ConfirmationModal";

const Header = (props) => {
  let location = useLocation();
  const navigate = useNavigate();

  const [confirm, setConfirm] = React.useState(false);
  const [selected, setSelected] = React.useState("Default");

  const handleSelected = (item) => {
    setSelected(item);
  };

  const toggleModal = () => setConfirm(!confirm);

  const changePage = () => {
    if (location.pathname === "/chat") {
      setConfirm(true);
    } else if (location.pathname === "/audio-chat") {
      setConfirm(true);
    } else {
      navigate("/");
    }
  };
  const { loginHandler, registerHandler, nearMeHandler } = props;
  return (
    <nav className="navbar navbar-expand-lg navbar-light main-header">
      <div className="container-fluid">
        <ConfirmationModal
          confirm={confirm}
          setConfirm={setConfirm}
          toggleModal={toggleModal}
        />

        {/* <span
          classNameName="common-btn-link rounded cursor-pointer"
          onClick={nearMeHandler}
        >
          <a>near me</a>
        </span> */}
        <ul className="navbar-nav m-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <a
              className="logo nav-link active position-absolute cursor-pointer"
              aria-current="page"
              // href="/Reach-Alike"
              onClick={changePage}
            >
              <img src={logo} className="img-fluid" />
            </a>
          </li>
        </ul>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo03"
          aria-controls="navbarTogglerDemo03"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-between"
          id="navbarTogglerDemo03"
        >
          <ul className="navbar-nav mr-auto mb-2 mb-lg-0 ms-1">
            <li className="nav-item dropdown">
              <a
                className="common-btn-link dropdown-toggle rounded cursor-pointer"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {selected}
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <a
                    className={`dropdown-item ${
                      selected === "Default" ? "active" : ""
                    }`}
                    href="#"
                    onClick={() => handleSelected("Default")}
                  >
                    Default
                  </a>
                </li>
                <li>
                  <a
                    className={`dropdown-item ${
                      selected === "Lifestyle" ? "active" : ""
                    }`}
                    href="#"
                    onClick={() => handleSelected("Lifestyle")}
                  >
                    Lifestyle
                  </a>
                </li>
                <li>
                  <a
                    className={`dropdown-item ${
                      selected === "Enterprenuership" ? "active" : ""
                    }`}
                    href="#"
                    onClick={() => handleSelected("Enterprenuership")}
                  >
                    Enterprenuership
                  </a>
                </li>
                <li>
                  <a
                    className={`dropdown-item ${
                      selected === "Business" ? "active" : ""
                    }`}
                    href="#"
                    onClick={() => handleSelected("Business")}
                  >
                    Business
                  </a>
                </li>
                <li>
                  <a
                    className={`dropdown-item ${
                      selected === "Entertainment" ? "active" : ""
                    }`}
                    href="#"
                    onClick={() => handleSelected("Entertainment")}
                  >
                    Entertainment
                  </a>
                </li>
                <li>
                  <a
                    className={`dropdown-item ${
                      selected === "Education" ? "active" : ""
                    }`}
                    href="#"
                    onClick={() => handleSelected("Education")}
                  >
                    Education
                  </a>
                </li>
                <li>
                  <a
                    className={`dropdown-item ${
                      selected === "Near Me" ? "active" : ""
                    }`}
                    href="#"
                    onClick={() => {
                      handleSelected("Near Me");
                      nearMeHandler();
                    }}
                  >
                    Near Me
                  </a>
                  {/* <a
                    className="dropdown-item cursor-pointer"
                    onClick={nearMeHandler}
                  >
                    Near Me
                  </a> */}
                </li>
              </ul>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto mb-2 mb-lg-0 auth-list">
            <li className="nav-item me-2">
              <a
                className="nav-link rounded"
                aria-current="page"
                onClick={loginHandler}
              >
                Login
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link active rounded"
                aria-current="page"
                onClick={registerHandler}
              >
                Register
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
export default Header;
