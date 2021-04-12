import React, { useEffect, useState } from "react";
import "./style/home.css";
//Packages-----------------
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
//Function importing-----------------
import { isAuthenticated } from "../auth/helper";
import { getAllPost, getMyFollowingPost } from "./helper/PostHelper"
//Components-----------------
import Post from "../components/Post";
import ProfilePhoto from "../components/ProfilePhoto";
import Menu from "./Menu";
import ProfileCard from "./ProfileCard";
//Images-----------------
// import dostiKatta from "../dostiKatta.png"

const Home = () => {
  //useState---------------
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([]);

  const { user, token } = isAuthenticated();

  //useEffect---------------
  useEffect(() => {
    getAllPosts();
      // getMyFollowingPosts();
  }, []);

  //Get All Post Function---------------
  const getAllPosts = () => {
    //API call---------------
    getAllPost(user._id, token)
      .then((result) => {
        setData(result.data.posts);
        setLoading(false)
      })
      .catch((err) => console.log(err));
  };

  //Get only MY Following one's posts---------------
  const getMyFollowingPosts = () => {
    //API call---------------
    getMyFollowingPost(user._id, token)
      .then((result) => {
        setData(result.data.myposts);
        setLoading(false)
      })
      .catch((err) => console.log(err));
  };

  return (
      <Container className="themed-container home_page" fluid>
      <Menu />
      {loading ? 
      (<div className="load">
        {/* <img src={dostiKatta} alt="loading..." /> */}
      </div>) : (
      <Row style={{ margin: "0" }}>
        <Col className="left_box" md="3">
          <ProfileCard />
        </Col>
        <Col className="middle_box" md="6">
          {data && data.length >= 1 ? <h4 className="no_of_post">Showing {data ? data.length : 0} post</h4> : null}
          {data.length > 0 ?
            data.map((post, index) => {
              return (
                <div className="post" key={index}>
                  <Post post={post} />
                </div>
              );
            }) : (
              <div className="no_posts">
                {/* <img src={dostiKatta} alt="logo" width="230px" height="250px" /> */}
                <h1>Welcome to Snippet Share</h1>
                <h3>Time to Show Off</h3>
                <h3>Search and Follow users to see their code  </h3>
              </div>
            )}
        </Col>
        <Col className="right_box" md="3"></Col>
      </Row>
      )}
      </Container>
  );
};

export default Home;