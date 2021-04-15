import React, { useState } from "react";
import "./signin.css";
//Packages-----------------
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
//Function importing-----------------
import { signin, authenticate, isAuthenticated } from "../../auth/helper/index";
//Components-----------------
import LoginInput from "../../components/LoginInput";
//Images-----------------
import logoSnippetShare from "../../assets/logoSnippetShare.png"
import nerd from "../../assets/nerd.png"

const Signin = () => {
  //useState---------------
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    username: "",
    loading: false,
    didRedirect: false,
  });
  const [disableSignin, setDisableSignin] = useState(false);

  const { email, password, username, error, loading, didRedirect } = values;

  const { user } = isAuthenticated();

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  //Signin Function---------------
  const onSubmit = (event) => {
    setDisableSignin(true);
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    //API call---------------
    signin({ email, password, username })
      .then((data) => {
        setDisableSignin(false);
        if (data.error) {
          setValues({
            ...values,
            error: data.error,
            loading: false,
            didRedirect: false,
          });
        } else {
          authenticate(data, () => {
            setValues({
              ...values,
              didRedirect: true,
              error: false,
              loading: false,
              email: "",
              username: "",
              error: "",
            });
          });
        }
      })
      .catch(console.log("Sign In Failed"));
  };

  //Perform Redirect---------------
  const performRedirect = () => {
    if (didRedirect) {
      if (user && user.role === 1) {
        return <Redirect to="/admin/dashboard" />;
      } else {
        return <Redirect to="/home" />;
      }
    }
    if (isAuthenticated()) {
      return <Redirect to="/home" />;
    }
  };

  //LOADING Message---------------
  const loadingMessage = () => {
    return (
      loading && (
        <h2
          style={{
            display: loading ? "" : "none",
            fontSize: "1em",
            color: "#00ab66",
            textAlign: "center",
          }}
        >
          Loading......!
        </h2>
      )
    );
  };

  //ERROR Message---------------
  const errorMessage = () => {
    return (
      <h3
        style={{
          display: error ? "" : "none",
          fontSize: "1em",
          color: "red",
          textAlign: "center",
        }}
      >
        {error}
      </h3>
    );
  };

  //Signin Page JSX---------------
  const signInForm = () => {
    return (
      <Container className="themed-container signin_container" fluid>
        <Row>
          <Col md="7" sm="12">
            <Container className="signin_left_container">
              <Row>
                <img
                  src={logoSnippetShare}
                  alt="snippetShareLogo"
                  className="snippetShare_name"
                />
              </Row>
              <Row>
                <img
                  src={nerd}
                  alt="snippetShareLogo"
                  className="snippetShare_nerd"
                />
              </Row>
              <Row className="below_logo">
                <h4>
                  Meet millions of new people from all over the world and connect with them to make new friends.
                </h4>
              </Row>
            </Container>
          </Col>
          <Col md="5" sm="12">
            <Container className="signin_right_container">
              <Row className="signup_note_div">
                <h3 className="signup_note">
                  Not a Member?{" "}
                  <Link to="/signup" style={{ textDecoration: "none" }}>
                    <span>Sign UP</span>
                  </Link>
                </h3>
              </Row>
              <Row>
                <div className="signin_signin_box">
                  <LoginInput
                    labelName="Email"
                    inputType="email"
                    value={email}
                    onChangeEvent={handleChange("email")}
                  />
                  <h5 style={{ color: "black", textAlign: "center" }}>Or</h5>
                  <LoginInput
                    labelName="Username"
                    inputType="username"
                    value={username}
                    onChangeEvent={handleChange("username")}
                  />
                  <LoginInput
                    labelName="Password"
                    inputType="password"
                    value={password}
                    onChangeEvent={handleChange("password")}
                  />
                  {loadingMessage()}
                  {errorMessage()}
                  <Button onClick={onSubmit} className="signin_button" disabled={disableSignin}>
                    SIGN IN
                  </Button>
                </div>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    );
  };

  return (
    <>
      {signInForm()}
      {performRedirect()}
    </>
  );
};

export default Signin;

//Perform Redirect