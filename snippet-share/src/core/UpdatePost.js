import React, { useEffect, useState } from "react";
//Packages-----------------
import { Col, Container, Row, Button } from "react-bootstrap";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
//Function importing-----------------
import { isAuthenticated } from "../auth/helper";
import { getAPost, updatePost } from "./helper/PostHelper";
//Components-----------------
import Menu from "./Menu";

const UpdatePost = ({ match, location, history }) => {
  //useState---------------
  const [disableUpdatePost, setDisableUpdatePost] = useState(false);
  const [values, setValues] = useState({
    title: "",
    body: "",
    photo: "",
    formData: "",
  });

  const { user, token } = isAuthenticated();
  
  const { title, body, photo, formData } = values;
  
  //useEffect---------------
  useEffect(() => {
    preload(match.params.postId);
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

  //Preload the data of the posts---------------
  const preload = (postId) => {
    //API call---------------
    getAPost(postId, user._id, token).then((data) => {
      if (data.data.error) {
        errorNotify(data.data.error)
      } else {
        setValues({ ...values, title: data.data.title, body: data.data.body, formData: new FormData() });
      }
    });
  };

  //Update the Post Function---------------
  const postData = (event) => {
    setDisableUpdatePost(true);
    formData.set("title", title);
    formData.set("body", body);
    if (photo) {
      formData.set("photo", photo);
    } else {
      console.log("No Photo Added for update");
    }
    event.preventDefault();
    //API call---------------
    updatePost(user._id, token, formData, match.params.postId)
      .then((data) => {
        setDisableUpdatePost(false);
        if (data.data.error) {
          errorNotify(data.data.error);
        } else {
          setValues({
            ...values,
            title: "",
            body: "",
            photo: "",
            formData: "",
          });
          successNotify("Post Edited Successfully");
          setTimeout(() => {
            history.goBack()
          }, 3000);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    setValues({ ...values, [name]: value });
  };

  return (
    <Container className="themed-container create_post_container" fluid style={{ padding: "0" }} >
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
      <Row className="create_post" style={{ margin: "0" }}>
        <div className="create_post_div">
          <Row className="top_row">
            <Col xs="10" className="col">
              <input
                type="text"
                placeholder="Enter Title"
                value={title}
                onChange={handleChange("title")}
                className="title_input"
              />
            </Col>
            <Col xs="2" className="col">
              <div className="file_input_div">
                <input
                  onChange={handleChange("photo")}
                  type="file"
                  name="photo"
                  accept="image/png, image/jpeg"
                  // capture="camera"
                  placeholder="Choose a file"
                  className="file_input"
                />
                {/* <span>Add Image</span> */}
              </div>
            </Col>
          </Row>
          <Row>
            <textarea
              type="text"
              placeholder="Body"
              value={body}
              onChange={handleChange("body")}
              className="body_input"
            />
          </Row>
        </div>
        <Button
          className="create_post_button"
          onClick={(event) => {
            postData(event);
          }}
        >
          POST
        </Button>
      </Row>
    </Container>
  );
};

export default UpdatePost;