import React, { useEffect, useState } from "react";
import { API } from "../backend";
import "./style/post.css";
//Packages-----------------
import { Link } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
//Function importing-----------------
import { isAuthenticated } from "../auth/helper";
import { likeAPost, unLikeAPost } from "../core/helper/PostHelper";
//Components---------------------
import ProfilePhoto from "./ProfilePhoto";
//Images-----------------
// import likeButtonPic from "../likeButtonPic.png";
// import likedButtonPic from "../likedButtonPic.png";
// import commentPic from "../commentPic.png";

const Post = ({ post }) => {
  //useState---------------
  const [data, setData] = useState([]);
  const [disableLike, setDisableLike] = useState(false);
  const [disableUnLike, setDisableUnLike] = useState(false);

  const { user, token } = isAuthenticated();
  const [likedPost, setLikedPost] = useState(post.likes.includes(user._id));

  let Idate = new Date(post.createdAt);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  //useEffect---------------
  useEffect(() => {}, [data]);

  //Like a Post---------------
  const likePost = (postId) => {
    setDisableLike(true);
    //API call---------------
    likeAPost(user._id, token, postId)
      .then((result) => {
        setDisableUnLike(false);
        const newData = data.map((item) => {
          if (item._id === result.data._id) {
            return result.data;
          } else {
            return item;
          }
        });
        setData(newData);
        setLikedPost(true);
        // window.localStorage.setItem(post._id, true);
      })
      .catch((err) => console.log(err));
  };

  //Unlike a Post---------------
  const unlikePost = (postId) => {
    setDisableUnLike(true);
    //API call---------------
    unLikeAPost(user._id, token, postId)
      .then((result) => {
        setDisableLike(false);
        const newData = data.map((item) => {
          if (item._id === result.data._id) {
            return result.data;
          } else {
            return item;
          }
        });
        setData(newData);
        setLikedPost(false);
        // window.localStorage.setItem(post._id, false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Container className="post_box">
      <Row className="top_post_box">
        <Col className="left_post_box" xs="3">
          <Row className="postedBy_box">
            <Link
              to={
                user._id === post.postedBy._id
                  ? "/profile"
                  : `/otherProfile/${post.postedBy._id}`
              }
              style={{ textDecoration: "none" }}
            >
              <ProfilePhoto
                isPhoto={post.postedBy.profile_photo ? true : false}
                photoId={post.postedBy._id}
                css={{
                  width: window.innerWidth > 360 ? "80px" : "60px",
                  height: window.innerWidth > 360 ? "80px" : "60px",
                  borderRadius: "200px",
                }}
              />
              <h1>{post.postedBy.name}</h1>
              <h6>@{post.postedBy.username}</h6>
            </Link>
          </Row>
        </Col>
        <Col className="right_post_box" xs="9">
          <Row>
            <h2 className="post_title">{post.title}</h2>
          </Row>
          <Row>
            <h4 className="post_body">{post.body}</h4>
          </Row>
        </Col>
      </Row>
      <Row className="bottom_post_box">
        <Col className="reaction_post" xs="2">
          {likedPost ? (
            <div
              style={{opacity: disableUnLike ? 0.3 : 1}}
              onClick={() => {
                !disableUnLike && unlikePost(post._id);
              }}
            >
              {/* <img src={likedButtonPic} alt="Liked Button" /> */}
              <span style={{ color: "#24a0ed", fontWeight: "bold" }}>
                {/* {post.likes.length}  */}
                Liked
              </span>
            </div>
          ) : (
            <div
              style={{opacity: disableLike ? 0.3 : 1}}
              onClick={() => {
                !disableLike && likePost(post._id);
              }}
            >
              {/* <img
                className="like_button"
                alt="Like Button"
                src={likeButtonPic}
              /> */}
              <span>
                {/* {post.likes.length} */}
                Like
              </span>
            </div>
          )}
        </Col>
        <Col className="comments_post" xs="3">
          <Link
            to={`/post/view/${post._id}`}
            style={{ textDecoration: "none" }}
          >
            {/* <img src={commentPic} alt="Show Comments" /> */}
            <span> Comments</span>
          </Link>
        </Col>
        {/* <Col className="postedOn_post" xs="2"></Col> */}
        <Col className="postedOn_post" xs="7">
          <h4>Posted on:</h4>
          <h4>
            {/* ${Idate.getHours()}:${Idate.getMinutes()} */}
            {`${Idate.getDate()} ${
              monthNames[Idate.getMonth()]
            } ${Idate.getFullYear()}`}
          </h4>
        </Col>
      </Row>
    </Container>
  );
};

export default Post;