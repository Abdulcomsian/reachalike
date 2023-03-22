import React, { useEffect, useState } from "react";
import logo from "../../assets/img/logo.svg";
import "./style.css";

import { useLocation, useNavigate } from "react-router-dom";
import ConfirmationModal from "../../components/ConfirmationModal";

const Header = (props) => {
  const {
    isChatActive,
    onClickEndConfirmBtn,
    endConfirm,
    cancelConnect,
    starRating,
    setStarRating,
    sendStarRating,
    userIdentify,
    searchingUser,
    loginHandler,
    registerHandler,
    nearMeHandler
  } = props;

  let location = useLocation();
  const navigate = useNavigate();
  const [confirm, setConfirm] = React.useState(false);
  const toggleModal = () => setConfirm(!confirm);

  const changePage = () => {
    if (!isChatActive || endConfirm) {
      navigate("/");
      if (!searchingUser) {
        cancelConnect();
      }
    } else {
      if (location.pathname === "/chat") {
        setConfirm(true);
      } else if (location.pathname === "/audio-chat") {
        setConfirm(true);
      } else {
        navigate("/");
      }
    }
  };

  // Getting Groups
  const [groups, setGroups] = useState(null);
  const [selected, setSelected] = React.useState("Default");

  const handleSelected = (item) => {
    setSelected(item);
    // navigate(`/${item}`);
    window.history.pushState(`#${item}`)
  };

  useEffect(() => {
    fetch("https://websocket-dev.bayes-chat.com/groups")
      .then(res => res.json())
      .then(data => {
        const transformedData = data.groups.map((groupName, index) => {
          return { id: index, name: groupName }
        })
        setGroups(transformedData)
      })
      .catch(e => console.log(e.message))
  }, [])

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light main-header sticky-top"
      id="navbar"
      style={{ position: "fixed", top: 0, left: 0, right: 0 }}
    >
      <div className="container-fluid">
        <ConfirmationModal
          confirm={confirm}
          onClickEndConfirmBtn={onClickEndConfirmBtn}
          setConfirm={setConfirm}
          toggleModal={toggleModal}
          loginHandler={loginHandler}
          registerHandler={registerHandler}
          starRating={starRating}
          setStarRating={setStarRating}
          sendStarRating={sendStarRating}
          userIdentify={userIdentify}
        />
        <ul className="navbar-nav m-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <a
              className="logo nav-link active position-absolute cursor-pointer"
              aria-current="page"
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
                {
                  groups?.map(group => (
                    <li key={group.id}>
                      <a
                        className={`dropdown-item ${selected === group.name ? "active" : ""
                          }`}
                        href={`#${group.name}`}
                        onClick={() => handleSelected(group.name)}
                      >
                        {group.name}
                      </a>
                    </li>
                  ))
                }
                <li>
                  <a
                    className={`dropdown-item ${selected === "Near Me" ? "active" : ""
                      }`}
                    href="#"
                    onClick={() => {
                      handleSelected("Near Me");
                      nearMeHandler();
                    }}
                  >
                    Near Me
                  </a>
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
