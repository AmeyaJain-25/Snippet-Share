import React, { useEffect, useState } from "react";
import "./style/profile.css";
//Packages-----------------
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
//Function importing-----------------
import { isAuthenticated } from "../auth/helper";
import { addEditProfilePhoto, getProfileOfUser } from "./helper/UserHelper";
//Components-----------------
import Post from "../components/Post";
import ProfilePhoto from "../components/ProfilePhoto";
import Menu from "./Menu";
//Images-----------------
// import camera from "../camera.gif"
// import dostiKatta from "../dostiKatta.png";
import { Link } from "react-router-dom";

const Profile = () => {
  //useState---------------
  const [myPost, setmyPost] = useState([]);
  const [profile, setProfile] = useState();
  const [gotData, setGotData] = useState(false);
  const [disableProfPhoto, setDisableProfPhoto] = useState(false);
  const [followingShow, setFollowingShow] = useState(false);
  const [followersShow, setFollowersShow] = useState(false);
  const [values, setValues] = useState({
    profile_photo: "",
    formData: "",
  });

  const { user, token } = isAuthenticated();

  const { profile_photo, formData } = values;

  //useEffect---------------
  useEffect(() => {
    getMYPosts();
  }, []);

  //Toast Messages---------------
  const successNotify = (successMessage) => toast.success(successMessage, {
  position: "bottom-center",
  autoClose: 5000,
  draggablePercent: 60,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  });
  const errorNotify = (errorMessage) => toast.error(errorMessage, {
    position: "bottom-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  //Get my posts Functions---------------
  const getMYPosts = () => {
    //API call---------------
    getProfileOfUser(user._id, user._id, token)
      .then((result) => {
        if (result.error) {
          errorNotify(result.error);
          return setGotData(false);
        }
        console.log(result.data);
        setProfile(result.data.user);
        setmyPost(result.data.posts);
        setGotData(true);
      })
      .catch((err) => console.log(err));
  };

  //Add Profile Photo Function---------------
  const addProfilePhoto = (event) => {
    setDisableProfPhoto(true);
    event.preventDefault();
    if (!profile_photo) {
      errorNotify("Please select a Photo to upload")
      setDisableProfPhoto(false);
      return console.log("Cannot Add Empty Photo");
    }
    formData.set("profile_photo", profile_photo);
    //API call---------------
    addEditProfilePhoto(user._id, token, formData)
      .then((data) => {
        setDisableProfPhoto(false);
        successNotify("Profile Photo Added successfully")
        setProfile(data.data);
        setValues({ ...values, profile_photo: "", formData: "" });
        setTimeout(() => {
          successNotify("Refresh the Page or Please wait for some time to see your photo")  
        }, 2000);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Container className="themed-container profile_page" fluid style={{ padding: "0" }} >
      <ToastContainer 
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{maxWidth: "300px"}}
      />
      <Menu />
      {!gotData ?
      (<div className="load">
        {/* <img src={dostiKatta} alt="loading..." /> */}
      </div>) : (
        <Row style={{ margin: "0" }}>
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
          background: "#86b7fe"
        }}
        >
          <Modal.Title id="example-custom-modal-styling-title">
            Following
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
        style={{
          background: "#ffe7c3"
        }}
        >
          {profile.following.map((f, i) => {
            return (
              <div className="searched_user" key={i}>
            <Link
              style={{ color: "#707070", textDecoration: "none" }}
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
          background: "#86b7fe"
        }}
        >
          <Modal.Title id="example-custom-modal-styling-title">
            Followers
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
        style={{
          background: "#ffe7c3"
        }}
        >
          {profile.followers.map((f, i) => {
            return (
              <div className="searched_user" key={i}>
            <Link
              style={{ color: "#707070", textDecoration: "none" }}
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
          <Col className="left_box" md="3">
            <div className="hover_div">
              <div className="profile_photo_div">
                <ProfilePhoto
                  className="profile_photo"
                  isPhoto={profile.profile_photo ? true : false}
                  photoId={profile._id}
                  css={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "80px",
                    marginBottom: "5px",
                  }}
                />
              </div>
              <div className="hover_camera">
                {/* <img src={camera} width="150px" height="150px" /> */}
              </div>
              <input
                  onChange={(e) => {
                    setValues({
                      ...values,
                      profile_photo: e.target.files[0],
                      formData: new FormData(),
                    });
                  }}
                  type="file"
                  name="profile_photo"
                  accept="image/png, image/jpeg"
                  placeholder="Choose a photo"
                  className="input_file"
              />
            </div>
            <Button onClick={addProfilePhoto} disabled={disableProfPhoto} className="new_post">Edit Profile Photo</Button>
          </Col>
          <Col className="top_box" md="6">
            <Row className="name_box">
              <h1 className="name">{profile.name}</h1>
            </Row>
            <Row className="username_box">
              <h1 className="username">@{profile.username}</h1>
            </Row>
            <Row className="follow_unfollow_status">
              <Col className="followers" xs="4" onClick={() => setFollowersShow(true)}>
                <p>{profile.followers.length}</p>
                <span>Followers</span>
              </Col>
              <Col className="following" xs="4" onClick={() => setFollowingShow(true)}>
                <p>{profile.following.length}</p>
                <span>Following</span>
              </Col>
              <Col className="posts" xs="4">
                <p>{myPost.length}</p>
                <span>Posts</span>
              </Col>
            </Row>
            <Row className="bottom_post_box">
              {myPost.map((post, index) => {
                return (
                  <div key={index} className="post_div">
                    <Post post={post} />
                  </div>
                );
              })}
            </Row>
          </Col>
          <Col md="3"></Col>
        </Row>
      )}
    </Container>
  );
};

export default Profile;