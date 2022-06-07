import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import AuthModal from "./modals/authmodal.js";
import AccountModal from "./modals/accountmodal.js";
import Identicon from "identicon.js";
import { useMoralis } from "react-moralis";

const initialUserState = {
  id: "",
  address: "",
};

const style = {
  navLogo: {
    fontFamily:
      '"Newsreader", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  },
};

const formatter = (str) => {
  if (str) {
    return `${str.slice(0, 6)}...${str.slice(str.length - 6)}`;
  }
  return "";
};

export default function Navbar() {
  const { logout, isAuthenticated, isAuthUndefined, user } = useMoralis();

  const [authModal, setAuthModal] = useState({
    isOpened: false,
  });
  const [accountModal, setAccountModal] = useState({
    isOpened: false,
  });
  const [userData, setUserData] = useState({
    id: "",
    address: "",
  });

  const modals = {
    auth: setAuthModal,
    account: setAccountModal,
  };

  useEffect(() => {
    if (isAuthenticated) {
      setUserData({
        id: user.id,
        address: user.attributes.accounts[0],
      });
    } else {
      setUserData(initialUserState);
    }
  }, [isAuthenticated]);

  const closeModal = (modal) => {
    modals[modal]({ isOpened: false });
  };

  const loggout = async () => {
    logout();
    console.log("logged out");
    setAccountModal({ isOpened: false });
  };

  return (
    <div>
      {accountModal.isOpened ? (
        <AccountModal
          loggout={loggout}
          userData={userData}
          formatter={formatter}
          closeModal={() => closeModal("account")}
        />
      ) : null}
      {authModal.isOpened ? (
        <AuthModal closeModal={() => closeModal("auth")} />
      ) : null}
      <nav
        className="navbar navbar-expand-lg navbar-light fixed-top shadow-sm "
        id="mainNav"
        style={{
          background: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(4px)",
        }}
      >
        <div className="container px-5 ">
          <a
            className="navbar-brand fw-bold"
            href="#page-top"
            style={style.navLogo}
          >
            ChainBlock
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item active">
                <NavLink to="/transfer" className="nav-link">
                  💸Transfer{" "}
                </NavLink>
              </li>
              <li className="nav-item active">
                <NavLink to="/" className="nav-link">
                  🏠Home{" "}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/dex" className="nav-link">
                  🚀DEX{" "}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/history" className="nav-link">
                  📜History{" "}
                </NavLink>
              </li>
            </ul>
            {isAuthUndefined ? (
              <span
                style={{ cursor: "pointer" }}
                className="text-info font-weight-bold navbar-text"
              >
                <img
                  width="18px"
                  src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif"
                />
              </span>
            ) : isAuthenticated && userData.address != "" ? (
              <span
                style={{
                  cursor: "pointer",
                  backgroundColor: "rgb(240, 242, 245)",
                }}
                onClick={() => setAccountModal({ isOpened: true })}
                className="rounded px-2 text-info font-weight-bold navbar-text"
              >
                <span style={{ fontWeight: "bold" }} className="text-success">
                  {formatter(userData.address)}
                </span>
                <img
                  className="mx-1 rounded"
                  width="27"
                  height="27"
                  src={`data:image/png;base64,${new Identicon(
                    userData.address,
                    30
                  ).toString()}`}
                  alt=""
                />
              </span>
            ) : (
              <span
                style={{ cursor: "pointer" }}
                onClick={() => setAuthModal({ isOpened: true })}
                className="text-info font-weight-bold navbar-text"
              >
                🔗Authenticate
              </span>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
