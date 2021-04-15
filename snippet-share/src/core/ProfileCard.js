import React, { useEffect, useState } from "react";
import "./style/profileCard.css";
//Packages-----------------
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
//Function importing-----------------
import { isAuthenticated } from "../auth/helper";
import { getProfileOfUser } from "./helper/UserHelper";
//Components-----------------
import ProfilePhoto from "../components/ProfilePhoto";

const ProfileCard = () => {
  //useState---------------
  const [profile, setProfile] = useState();
  const [posts, setPosts] = useState([]);
  const [gotData, setGotData] = useState();
  const [followingShow, setFollowingShow] = useState(false);
  const [followersShow, setFollowersShow] = useState(false);

  const { user, token } = isAuthenticated();

  //useEffect---------------
  useEffect(() => {
    getProfile();
  }, []);
  
  //Get Profile of the User Function---------------
  const getProfile = () => {
    //API call---------------
    getProfileOfUser(user._id, user._id, token)
      .then((result) => {
        if (result.error) {
          return setGotData(false);
        }
        setProfile(result.data.user);
        setPosts(result.data.posts);
        setGotData(true);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Container className="profile_card_box">
      {gotData && (
        <>
        <Modal
        show={followingShow}
        onHide={() => setFollowingShow(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        animation={true}
        style={{
          background: "rgb(0, 0, 0, 0.6)",
          fontFamily: "'Truculenta', sans-serif"
        }}
      >
        <Modal.Header closeButton 
        style={{
          background: "#05386B",
          color: "#EDF5E1"
        }}
        >
          <Modal.Title id="example-custom-modal-styling-title">
            Following
          </Modal.Title>
        </Modal.Header>
        <Modal.Body 
        style={{
          background: "#5CDB95",
        }}
        >
          {profile.following.map((f, i) => {
            return (
              <div className="searched_user" key={i}>
            <Link
              style={{ color: "#000", textDecoration: "none" }}
              to={
                f._id === user._id
                  ? "/profile"
                  : `/otherProfile/${f._id}`
              }
            >
              <ProfilePhoto
                isPhoto={f.profile_photo ? true : false}
                photoId={f._id}
                css={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "80px",
                }}
              />
              <span>{f.username}</span>
            </Link>
          </div>
            );
          })}
        </Modal.Body>
      </Modal>
      <Modal
        show={followersShow}
        onHide={() => setFollowersShow(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        animation={true}
        style={{
          background: "rgb(0, 0, 0, 0.6)",
          fontFamily: "'Truculenta', sans-serif"
        }}
      >
        <Modal.Header closeButton
        style={{
          background: "#05386B",
          color: "#EDF5E1"
        }}
        >
          <Modal.Title id="example-custom-modal-styling-title">
            Followers
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            background: "#5CDB95",
          }}
        > 
          {profile.followers.map((f, i) => {
            return (
              <div className="searched_user" key={i}>
            <Link
              style={{ color: "#000", textDecoration: "none" }}
              to={
                f._id === user._id
                  ? "/profile"
                  : `/otherProfile/${f._id}`
              }
            >
              <ProfilePhoto
                isPhoto={f.profile_photo ? true : false}
                photoId={f._id}
                css={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "80px",
                }}
              />
              <span>{f.username}</span>
            </Link>
          </div>
            );
          })}
        </Modal.Body>
      </Modal>
          <div className="profile_card_div">
            <Row className="top_profile_card_box">
              <Link
                to="/profile"
                style={{ textDecoration: "none", color: "black" }}
              >
                <ProfilePhoto
                  isPhoto={profile.profile_photo ? true : false}
                  photoId={profile._id}
                  css={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "80px",
                    marginBottom: "5px",
                  }}
                />
                <h1>{profile.name}</h1>
                <h2>@{profile.username}</h2>
              </Link>
            </Row>
            <Row className="bottom_profile_card_box">
              <Col className="followers" sm="4" onClick={() => setFollowersShow(true)}>
                <p>{profile.followers.length}</p>
                <span>Followers</span>
              </Col>
              <Col className="following" sm="4" onClick={() => setFollowingShow(true)}>
                <p>{profile.following.length}</p>
                <span>Following</span>
              </Col>
              <Col className="posts" sm="4">
                <p>{posts.length}</p>
                <span>Posts</span>
              </Col>
            </Row>
          </div>
          <div className="create_post_button">
            <Link to="/post/create" style={{ textDecoration: "none" }}>
              <Button className="new_post">Create a New POST</Button>
            </Link>
          </div>
        </>
      )}
    </Container>
  );
};

export default ProfileCard;