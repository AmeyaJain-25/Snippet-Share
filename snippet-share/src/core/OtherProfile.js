import React, { useEffect, useState } from "react";
//Packages-----------------
import { Button, Col, Container, Row } from "react-bootstrap";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
//Function importing-----------------
import { isAuthenticated } from "../auth/helper";
import { followAUser, getProfileOfUser, unFollowAUser } from "./helper/UserHelper";
//Components-----------------
import Post from "../components/Post";
import ProfilePhoto from "../components/ProfilePhoto";
import Menu from "./Menu";
//Images-----------------
// import dostiKatta from "../dostiKatta.png";

const OtherProfile = ({ match }) => {
  //useEffect---------------
  const [otherUser, setOtherUser] = useState();
  const [myPost, setmyPost] = useState([]);
  const [gotData, setGotData] = useState(false);
  const [disableFollow, setDisableFollow] = useState(false);
  const [disableUnFollow, setDisableUnFollow] = useState(false);

  const { user, token } = isAuthenticated();

  //useEffect---------------
  useEffect(() => {
    getMYPosts(match.params.userid);
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

  //Get my Posts Functions---------------
  const getMYPosts = (otherUserId) => {
    //API call---------------
    getProfileOfUser(user._id, otherUserId, token)
      .then((result) => {
        setOtherUser(result.data.user);
        setmyPost(result.data.posts);
        setGotData(true);
      })
      .catch((err) => console.log(err));
  };

  //Follow a User---------------
  const followUser = (followId) => {
    setDisableFollow(true);
    //API call---------------
    followAUser(user._id, token, followId)
      .then((data) => {
        setOtherUser(otherUser);
        getMYPosts(match.params.userid);
        successNotify(`Followed ${otherUser.name}`);
        setDisableUnFollow(false);
        // setTimeout(() => {
        //   setDisableFollow(false)
        // }, 2000);
        // setOtherUser((prevState) => {
        //   return {
        //     ...prevState,
        //     user: data,
        //     // user: {
        //     //   ...prevState.user,
        //     //   followers: [...prevState.user.followers, data._id],
        //     // },
        //   };
        // });
      })
      .catch((err) => console.log(err));
  };

  //Unfollow a User---------------
  const unFollowUser = (unfollowId) => {
    setDisableUnFollow(true);
    //API call---------------
    unFollowAUser(user._id, token, unfollowId)
      .then((data) => {
        setOtherUser(otherUser);
        getMYPosts(match.params.userid)
        errorNotify(`Unfollowed ${otherUser.name}`);
        setDisableFollow(false);
        // setOtherUser((prevState) => {
        //   return {
        //     ...prevState,
        //     user: data,
        //   };
        // });
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
      {!gotData ? (<div className="load">
        {/* <img src={dostiKatta} alt="loading..." /> */}
      </div>) : (
        <Row style={{ margin: "0" }}>
          <Col className="left_box" md="3">
            <div className="profile_photo_div">
              <ProfilePhoto
                isPhoto={otherUser.profile_photo ? true : false}
                photoId={otherUser._id}
                css={{ width: "150px", height: "150px", borderRadius: "80px", marginBottom: "5px", }}
              />
            </div>
            {
              otherUser._id !== user._id &&
                (otherUser.followers.some( f => f._id === user._id) ? (
                  <Button
                    className="follow_unfollow_button"
                    onClick={() => {
                      unFollowUser(otherUser._id);
                    }}
                    disabled={disableUnFollow}
                  >
                    UNFOLLOW
                  </Button>
                ) : (
                  <Button
                    className="follow_unfollow_button"
                    onClick={() => {
                      followUser(otherUser._id);
                    }}
                    disabled={disableFollow}
                    style={{background: "seagreen"}}
                  >
                    FOLLOW
                  </Button>
                ))
            }
          </Col>
          <Col className="top_box" md="6">
            <Row className="name_box">
              <h1 className="name">{otherUser.name}</h1>
            </Row>
            <Row className="username_box">
              <h1 className="username">@{otherUser.username}</h1>
            </Row>
            <Row className="follow_unfollow_status">
              <Col className="followers" xs="4">
                <p>{otherUser.followers.length}</p>
                <span>Followers</span>
              </Col>
              <Col className="following" xs="4">
                <p>{otherUser.following.length}</p>
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

export default OtherProfile;