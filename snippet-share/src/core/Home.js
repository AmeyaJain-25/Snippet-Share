import React, { useEffect, useState } from "react";
import "./style/home.css";
//Packages-----------------
import { Col, Container, Modal, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
//Function importing-----------------
import { isAuthenticated } from "../auth/helper";
import { getAllPost, getMyFollowingPost } from "./helper/PostHelper"
import { searchForUser } from "./helper/UserHelper"
//Components-----------------
import Post from "../components/Post";
import ProfilePhoto from "../components/ProfilePhoto";
import Menu from "./Menu";
import ProfileCard from "./ProfileCard";
// Syntax Highlighter
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
//Images-----------------
// import dostiKatta from "../dostiKatta.png"

const Home = () => {
  //useState---------------
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchUserData, setsearchUserData] = useState([]);
  const [snippetModal, setSnippetModal] = useState(false);

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

  //Search User Function---------------
  const searchUser = (username) => {
    //API call---------------
    searchForUser(user._id, token, username)
      .then((result) => {
        if (result.data.length === 0) {
          document.querySelector(
            ".home_page .right_box .input_box"
          ).style.borderBottom = "none";
          document.querySelector(
            ".home_page #customScrollBar"
          ).style.margin = "0px";
        } else {
          document.querySelector(
            ".home_page #customScrollBar"
          ).style.margin = "10px 1px";
          document.querySelector(
            ".home_page .right_box .input_box"
          ).style.borderBottom = "1px solid rgba(0, 0, 0, 0.2)";
        }
        console.log(result.data);
        setsearchUserData(result.data);
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
        <Modal
          show={snippetModal}
          onHide={() => setSnippetModal(false)}
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
              Snippet
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              background: "#ffe7c3"
            }}
          > 
          {selectedPost && (
            <SyntaxHighlighter
            language={selectedPost.snippetLang}
            style={dracula}
            showLineNumbers
          >
            {selectedPost.snippet}
          </SyntaxHighlighter>
          )}
          </Modal.Body>
        </Modal>
        <Col className="left_box" md="3">
          <ProfileCard />
        </Col>
        <Col className="middle_box" md="6">
        <div className="search_box" id="mob_search_box">
            <div className="input_box">
              <input
                className="search_user_input"
                type="text"
                placeholder="Enter Friend's Username"
                onChange={(e) => {
                  searchUser(e.target.value);
                }}
              />
            </div>
            <div className="searched_box scrollbar" id="customScrollBar">    
              {searchUserData.map((userData, index) => {
                return (
                  <Link
                    style={{ color: "#707070", textDecoration: "none" }}
                    to={
                      userData._id === user._id
                        ? "/profile"
                        : `/otherProfile/${userData._id}`
                    }
                  >
                    <div className="searched_user" key={index}>
                      <ProfilePhoto
                        isPhoto={userData.profile_photo ? true : false}
                        photoId={userData._id}
                        css={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "80px",
                        }}
                      />
                      <span>{userData.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
          {data && data.length >= 1 ? <h4 className="no_of_post">Showing {data ? data.length : 0} post</h4> : null}
          {data.length > 0 ?
            data.map((post, index) => {
              return (
                <div className="post" key={index}>
                  <Post post={post} setSelectedPost={setSelectedPost} setSnippetModal={setSnippetModal}/>
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
        <Col className="right_box" md="3">
          <div className="search_box">
            <div className="input_box">
              <input
                className="search_user_input"
                type="text"
                placeholder="Enter Friend's Username"
                onChange={(e) => {
                  searchUser(e.target.value);
                }}
              />
            </div>
            {searchUserData.map((userData, index) => {
              return (
                <div className="searched_user" key={index}>
                  <Link
                    style={{ color: "#707070", textDecoration: "none" }}
                    to={
                      userData._id === user._id
                        ? "/profile"
                        : `/otherProfile/${userData._id}`
                    }
                  >
                    <ProfilePhoto
                      isPhoto={userData.profile_photo ? true : false}
                      photoId={userData._id}
                      css={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "80px",
                      }}
                    />
                    <span>{userData.name}</span>
                    {/* <span>{userData.username}</span> */}
                  </Link>
                </div>
              );
            })}
          </div>
        </Col>
      </Row>
      )}
      </Container>
  );
};

export default Home;