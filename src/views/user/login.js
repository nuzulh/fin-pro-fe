import React, { useState, useEffect } from "react";
import { Row, Button } from "reactstrap";
import { connect } from "react-redux";
import { NotificationManager } from "components/common/react-notifications";
import { loginUser } from "redux/actions";
import { Colxx } from "components/common/CustomBootstrap";
import bgImg from "assets/img/login/Cogindo Welcome.png";
import logo from "assets/logos/cogindo.png";

const Login = ({ history, loading, error, loginUserAction }) => {
  useEffect(() => {
    if (error) {
      NotificationManager.warning(error, "Login Error", 3000, null, null, "");
    }
  }, [error]);

  const onUserLogin = (e, username, password) => {
    e.preventDefault();
    if (!loading) {
      if (username !== "" && password !== "") {
        loginUserAction(
          { username, password },
          history
        );
      }
    }
  };

  return (
    <Row>
      <Colxx xxs="12">
        <img src={logo} alt="logo" />
        <Row>
          <Colxx xxs="12" lg="6">
            <img src={bgImg} className="w-100" />
          </Colxx>
          <div className="my-5 d-flex flex-column align-items-center">
            <h2 className="text-primary font-weight-light mb-2">
              Cogindo Financing Application
            </h2>
            <div className="my-4">
              <h1
                className="text-primary font-weight-bold"
                style={{
                  fontSize: "4.5rem",
                  background:
                    "linear-gradient(265.04deg, #E1701A 1.74%, #FFB800 94.82%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textFillColor: "transparent",
                }}
              >
                Selamat datang!
              </h1>
            </div>
            <div className="mx-4">
              <Button
                size="xl"
                color="primary mt-2"
                className={`btn-shadow mr-4 btn-multiple-state align-self-lg-end ${loading ? "show-spinner" : ""
                  }`}
                onClick={(e) => onUserLogin(e, "direktur", "direktur")}
              >
                <span className="spinner d-inline-block">
                  <span className="bounce1" />
                  <span className="bounce2" />
                  <span className="bounce3" />
                </span>
                <span className="label h6 font-weight-bold">Direktur</span>
              </Button>
              <Button
                size="xl"
                color="primary mt-2"
                className={`btn-shadow btn-multiple-state align-self-lg-end ${loading ? "show-spinner" : ""
                  }`}
                onClick={(e) => onUserLogin(e, "staff", "staff")}
              >
                <span className="spinner d-inline-block">
                  <span className="bounce1" />
                  <span className="bounce2" />
                  <span className="bounce3" />
                </span>
                <span className="label h6 font-weight-bold">Staff</span>
              </Button>
            </div>
          </div>
        </Row>
      </Colxx>
    </Row>
  );
};
const mapStateToProps = ({ authUser }) => {
  const { loading, error } = authUser;
  return { loading, error };
};

export default connect(mapStateToProps, {
  loginUserAction: loginUser,
})(Login);
