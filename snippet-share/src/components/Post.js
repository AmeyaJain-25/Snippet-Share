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
import likeButtonPic from "../assets/likeButtonPic.png";
import likedButtonPic from "../assets/likedButtonPic.svg";
import commentPic from "../assets/commentPic.svg";

const Post = ({ post, setSelectedPost, setSnippetModal }) => {
  //useState---------------
  const [postData, setPostData] = useState(post)
  const [disableLike, setDisableLike] = useState(false);
  const [disableUnLike, setDisableUnLike] = useState(false);

  const { user, token } = isAuthenticated();
  const [likedPost, setLikedPost] = useState(postData.likes.includes(user._id));

  let Idate = new Date(postData.createdAt);
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

  //Like a Post---------------
  const likePost = (postId) => {
    setDisableLike(true);
    //API call---------------
    likeAPost(user._id, token, postId)
      .then((result) => {
        setDisableUnLike(false);
        setPostData(result.data);
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
        setPostData(result.data);
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
                user._id === postData.postedBy._id
                  ? "/profile"
                  : `/otherProfile/${postData.postedBy._id}`
              }
              style={{ textDecoration: "none" }}
            >
              <ProfilePhoto
                isPhoto={postData.postedBy.profile_photo ? true : false}
                photoId={postData.postedBy._id}
                css={{
                  width: window.innerWidth > 360 ? "80px" : "60px",
                  height: window.innerWidth > 360 ? "80px" : "60px",
                  borderRadius: "200px",
                }}
              />
              <h1>{postData.postedBy.name}</h1>
              <h6>@{postData.postedBy.username}</h6>
            </Link>
          </Row>
        </Col>
        <Col className="right_post_box" xs="9">
          <Row>
            <h2 className="post_title">{postData.title}</h2>
          </Row>
          <Row>
            <h4 className="post_body">{postData.body}</h4>
          </Row>
          <Row>
            <h4 
            style={{
              position: "absolute",
              right: "10px",
              bottom: "0px",
              cursor: "pointer",
              color: "#05386B"
            }} 
            onClick={() => {
              setSelectedPost(postData);
              setSnippetModal(true);
            }}>&lt;/&gt;</h4>
          </Row>
        </Col>
      </Row>
      <Row className="bottom_post_box">
        <Col className="reaction_post" xs="2">
          {likedPost ? (
            <div
              style={{opacity: disableUnLike ? 0.3 : 1}}
              onClick={() => {
                !disableUnLike && unlikePost(postData._id);
              }}
            >
              <img src={likedButtonPic} alt="Liked Button" />
              <span>
                {postData.likes.length}{" "}
                Liked
              </span>
            </div>
          ) : (
            <div
              style={{opacity: disableLike ? 0.3 : 1}}
              onClick={() => {
                !disableLike && likePost(postData._id);
              }}
            >
              <img
                className="like_button"
                alt="Like Button"
                src={likeButtonPic}
              />
              <span>
                {postData.likes.length}{" "}
                Like
              </span>
            </div>
          )}
        </Col>
        <Col className="comments_post" xs="3">
          <Link
            to={`/post/view/${postData._id}`}
            style={{ textDecoration: "none" }}
          >
            <img src={commentPic} alt="Show Comments" />
            <span>
              {postData.comments.length}{" "}
              Comments
            </span>
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