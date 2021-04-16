import React, { useEffect, useState } from "react";
import "./style/menu.css";
//Packages-----------------
import { Link, withRouter } from "react-router-dom";
import { Button, Container, Row } from "react-bootstrap";
import { FaInfoCircle } from "react-icons/fa"
//Function importing-----------------
import { isAuthenticated, signout } from "../auth/helper";
import { getProfileOfUser } from "./helper/UserHelper";
//Componenets-----------------
import ProfilePhoto from "../components/ProfilePhoto";

const Menu = ({ history }) => {
  //useState---------------
  const [profile, setProfile] = useState({});
  const [gotData, setGotData] = useState(false);
  
  const { user, token } = isAuthenticated();

  //Toggle classmane active Function---------------
  const toggleMenu = () => {
    document.querySelector(".menu").classList.toggle("active");
  };

  //useEffect---------------
  useEffect(() => {
    getProfile();
  }, []);

  //Gte Profile of a User Function---------------
  const getProfile = () => {
    //API call---------------
    getProfileOfUser(user._id, user._id, token)
      .then((result) => {
        if (result.error) {
          return setGotData(false);
        }
        setProfile(result.data.user);
        // setmyPost(result.posts);
        setGotData(true);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Container className="menu_container" fluid>
      <Row style={{margin: "0px"}}>
        <Link to="/home" style={{ textDecoration: "none" }}>
          <h1 className="logoname_navbar">Snippet Share</h1>
        </Link>
        
        <div className="logout_box">
          <Button
            onClick={() => {
              signout(() => {
                return history.push("/");
              });
            }}
            className="logout"
          >
            Log Out
          </Button>
          {/* <Link to="/info" className="info_circle"><FaInfoCircle style={{fontSize: "1.5em", margin: "0 10px"}} title="About Us"/></Link> */}
          <div className="profile_photo_mob" onClick={() => toggleMenu()}>
            {gotData && (
              <ProfilePhoto
                className="profile_photo"
                isPhoto={profile.profile_photo ? true : false}
                photoId={profile._id}
                css={{
                  width: "45px",
                  height: "45px",
                  borderRadius: "200px",
                }}
              />
            )}
          </div>
          <div className="menu">
            <h3>{gotData && profile.name}</h3>
            <h4>@{gotData && profile.username}</h4>
            <ul>
              <li>
                <Link
                  to="/profile"
                  style={{ textDecoration: "none", color: "#05386B" }}
                >
                  <span>Profile</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/post/create"
                  style={{ textDecoration: "none", color: "#05386B" }}
                >
                  <span>Create Post</span>
                </Link>
              </li>
              <li
                onClick={() => {
                  signout(() => {
                    return history.push("/");
                  });
                }}
              >
                <span>Log Out</span>
              </li>
              {/* <li>
                <Link to="/info" style={{textDecoration: "none", color: "#05386B"}}>
                  <FaInfoCircle style={{fontSize: "1.5em", margin: "0 5px"}} title="About Us"/>About Us
                </Link>
              </li> */}
            </ul>
          </div>
        </div>
      </Row>
    </Container>
  );
};

export default withRouter(Menu);