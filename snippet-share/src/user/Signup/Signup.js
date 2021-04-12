import React, { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import { signup } from "../../auth/helper/index";
import LoginInput from "../../components/LoginInput";
// import logoWithSlogan from "../../logoWithSlogan.png";
import "./signup.css";

const Signup = () => {
  //useState---------------
  const [values, setValues] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    error: "",
    success: false,
  });
  const [disableSignup, setDisableSignup] = useState(false);

  const { name, email, username, password, error, success } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  //Signup Function---------------
  const onSubmit = (event) => {
    setDisableSignup(true);
    event.preventDefault();
    setValues({ ...values, error: false });
    //API call---------------
    signup({ name, email, username, password })
      .then((data) => {
        setDisableSignup(false);
        if (data.error) {
          setValues({ ...values, error: data.error, success: false });
        } else {
          setValues({
            ...values,
            name: "",
            email: "",
            username: "",
            error: "",
            password: "",
            success: true,
          });
        }
      })
      .catch(console.log("Error in SignUp"));
  };

  //SUCCESS Message---------------
  const successMessage = () => {
    return (
      <div>
        <h3
          style={{
            display: success ? "" : "none",
            fontSize: "1em",
            color: "#00ab66",
            textAlign: "center",
          }}
        >
          New Account Created Successfully
          <br />
          <Link to="/"> Please Login Here</Link>
        </h3>
        {success && <Redirect to="/" />}
      </div>
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

  //Signup Page JSX---------------
  const signUpForm = () => {
    return (
      <Container className="themed-container signup_container" fluid>
        <Row>
          <Col md="6" sm="12">
            <Container className="left_container">
              <div className="signup_box">
                <p className="register_text">Register</p>
                <hr />
                <LoginInput
                  labelName="Name"
                  inputType="text"
                  value={name}
                  onChangeEvent={handleChange("name")}
                />
                <LoginInput
                  labelName="Email"
                  inputType="email"
                  value={email}
                  onChangeEvent={handleChange("email")}
                />
                <LoginInput
                  labelName="Username"
                  inputType="text"
                  value={username}
                  onChangeEvent={handleChange("username")}
                />
                <LoginInput
                  labelName="Password"
                  inputType="password"
                  value={password}
                  onChangeEvent={handleChange("password")}
                />
                <p className="strong_password_note">
                  Use 5 or more characters to make a strong Password.
                </p>
                {successMessage()}
                {errorMessage()}
                <Button onClick={onSubmit} className="register_button" disabled={disableSignup}>
                  REGISTER
                </Button>
              </div>
            </Container>
          </Col>
          <Col md="6" sm="12">
            <Container className="right_container">
              <Row className="dostiKatta_name_row">
                {/* <img
                  src={logoWithSlogan}
                  alt="dostiKattaLogo"
                  className="dostiKatta_name"
                /> */}
              </Row>
              <Row className="below_logo">
                <h4>
                  {/* Meet millions of new people from all over the world, wherever
                  you are. Have a good chat, make new friend. */}
                </h4>
              </Row>
              <Row className="signup_note_div">
                <h3 className="signin_note">
                  Already a Member?{" "}
                  <Link to="/" style={{ textDecoration: "none" }}>
                    <span>Sign IN</span>
                  </Link>
                </h3>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    );
  };

  return <>{signUpForm()}</>;
};

export default Signup;