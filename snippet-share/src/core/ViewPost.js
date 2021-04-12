import React, { useEffect, useState } from "react";
import { API } from "../backend";
import "./style/viewPost.css";
//Packages-----------------
import { Col, Container, Row } from "react-bootstrap";
import { Link} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { BiEdit, BiTrash } from 'react-icons/bi';
//Function importing-----------------
import { isAuthenticated } from "../auth/helper";
import { commentOnAPost, deleteAPost, getAPost } from "./helper/PostHelper";
//Components-----------------
import Post from "../components/Post";
import ProfilePhoto from "../components/ProfilePhoto";
//Images-----------------
// import sendButtonPic from "../sendButtonPic.png";
// import crossSignPic from "../crossSignPic.png";
// import dostiKatta from "../dostiKatta.png";

const ViewPost = ({ match, history }) => {
  //useState---------------
  const [data, setData] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [commentValue, setCommentValue] = useState("");

  const { user, token } = isAuthenticated();

  //useEffect---------------
  useEffect(() => {
    viewPost(match.params.postId);
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

  //Get Post Data Function---------------
  const viewPost = (postId) => {
    //API call---------------
    getAPost(postId, user._id, token)
      .then((data) => {
        if (data.data.error) {
          setDataLoaded(false);
          errorNotify(data.data.error);
        } else {
          setData(data.data);
          setDataLoaded(true);
        }
      })
      .catch((err) => console.log(err));
  };

  //Delete Post Function---------------
  const deletePost = (postId) => {
    //API call---------------
    deleteAPost(user._id, token, postId)
      .then((data) => {
        successNotify("Successfully deleted the Post");
        setTimeout(() => {
          history.goBack();
        }, 3000);
      })
      .catch((err) => console.log(err));
  };

  //Comment on Post---------------
  const commentOnPost = (comment, postId) => {
    //API call---------------
    commentOnAPost(user._id, token, comment, postId)
      .then((result) => {
        setData(result.data);
      })
      .catch((err) => console.log(err));
  };

  //Check for empty comment and calling of comment Function---------------
  const onSubmitComment = (e) => {
    e.preventDefault();
    if (commentValue === "") {
      return errorNotify("Comment cannot be empty")
    }
    commentOnPost(commentValue, match.params.postId);
    setCommentValue("");
  };

  //Comments Data JSX---------------
  const showComment = (post) => {
    if (post.comments.length >= 1) {
      return post.comments.map((comm, index) => {
        return (
          <Row key={index} className="comm_box">
            <Col xs="1">
              <ProfilePhoto
                isPhoto={comm.postedBy.profile_photo ? true : false}
                photoId={comm.postedBy._id}
                css={{
                  width: "35px",
                  height: "35px",
                  borderRadius: "200px",
                }}
              />
            </Col>
            <Col xs="auto" style={{ paddingRight: "0" }}>
              <Link
                to={
                  user._id === comm.postedBy._id
                    ? "/profile"
                    : `/otherProfile/${comm.postedBy._id}`
                }
                style={{ textDecoration: "none" }}
              >
                <h2 className="comm_postedBy">{comm.postedBy.name}</h2>
              </Link>
            </Col>
            <Col xs="7">
              <h6 className="comm_text">{comm.comment}</h6>
            </Col>
          </Row>
        );
      });
    } else {
      return <h6 className="comm_no_comments">No Comments. Post a Comment</h6>;
    }
  };

  return (
    <Container className="themed-container view_post" fluid>
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
        {dataLoaded && data.postedBy._id === user._id && (
          <div
            style={{
              cursor: "pointer",
              fontSize: "1.2em",
              padding: "10px 0",
              display: "flex",
              alignItems: "center",
            }}
          >
            <BiTrash
              title="Delete"
              style={{
                fontWeight: "100",
                fontSize: "1.5em",
                color: "#fa002f",
              }}
              onClick={() => {
                {
                  if (
                    window.confirm(
                      "Are you sure you wish to DELETE this POST?"
                    )
                  )
                    deletePost(data._id);
                }
              }}
            />
            <Link
              style={{ textDecoration: "none", color: "#fff" }}
              to={`/post/update/${data._id}`}
            >
              <BiEdit
                aria-hidden="true"
                title="Edit"
                style={{
                  fontSize: "1.5em",
                  color: "#2e7ef7",
                }}
              />
            </Link>
          </div>
        )}
          {!dataLoaded ? (<div className="load">
        {/* <img src={dostiKatta} alt="loading..." /> */}
      </div>) : (
            <>
            <Row className="view_post_box">
              <div>
                {/* <img
                  src={crossSignPic}
                  alt="cross sign"
                  className="cancel_button"
                  onClick={() =>
                    setTimeout(() => {
                      history.goBack();
                    }, 100)
                  }
                /> */}
              </div>
              <div className="post_box_div">
                <Post post={data} />
              </div>
            </Row>
            <Row className="view_comment_box">
              <div className="comment_box_div">
                {dataLoaded && (
                  <>
                    <h1 className="like_length">{`${data.likes.length} likes`}</h1>
                    <h1 className="comment_length">{`${data.comments.length} comments`}</h1>
                    {showComment(data)}
                  </>
                )}

                <form onSubmit={(e) => onSubmitComment(e)}>
                  <input
                    type="text"
                    placeholder="Post your comments"
                    className="comment_input"
                    onChange={(e) => setCommentValue(e.target.value)}
                    value={commentValue}
                  />
                  {/* <img
                    src={sendButtonPic}
                    alt="Send Comment Button"
                    className="comment_send_button"
                    onClick={(e) => onSubmitComment(e)}
                  /> */}
                </form>
              </div>
            </Row>
            </>
          )}
    </Container>
  );
};

export default ViewPost;