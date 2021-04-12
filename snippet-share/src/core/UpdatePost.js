import React, { useEffect, useState } from "react";
import "./style/createPost.css";
//Packages-----------------
import { Col, Container, Row, Button, Form } from "react-bootstrap";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
//Function importing-----------------
import { isAuthenticated } from "../auth/helper";
import { getAPost, updatePost } from "./helper/PostHelper";
//Components-----------------
import Menu from "./Menu";
// Syntax Highlighter
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

const UpdatePost = ({ match, location, history }) => {
  //useState---------------
  const [disableUpdatePost, setDisableUpdatePost] = useState(false);
  const [values, setValues] = useState({
    title: "",
    body: "",
    fileType: "",
    pastedCode: "",
    formData: "",
  });

  const [codeInput, setCodeInput] = useState("paste");

  const { user, token } = isAuthenticated();
  
  const { title, body, formData, fileType, pastedCode } = values;
  
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
        setValues({ ...values, title: data.data.title, body: data.data.body, fileType: data.data.snippetLang, pastedCode: data.data.snippet, formData: new FormData() });
      }
    });
  };

  //Update the Post Function---------------
  const postData = (event) => {
    event.preventDefault();
    setDisableUpdatePost(true);
    if (!title || !body || !fileType || !pastedCode) {
      errorNotify("All fields are compulsory.");
      setDisableUpdatePost(false);
      return;
    }
    else {
      formData.set("title", title);
      formData.set("body", body);
      formData.set("snippet", pastedCode);
      formData.set("snippetLang", fileType);
      //API call---------------
      updatePost(user._id, token, formData, match.params.postId)
        .then((data) => {
          setDisableUpdatePost(false);
          if (data.data.error) {
            errorNotify(data.data.error);
          } else {
            successNotify("Post Edited Successfully");
            setValues({
              ...values,
              title: "",
              body: "",
              fileType: "",
              pastedCode: "",
              formData: "",
            });
            setTimeout(() => {
              history.goBack()
            }, 3000);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const fileTypesDictionary = {
    html: "html",
    css: "css",
    js: "javascript",
    ts: "typescript",
    py: "python",
    java: "java",
    cpp: "cpp",
    php: "php",
  };

  function readFileContent(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }

  const handleChange = (name) => (event) => {
    const value = name === "file" ? event.target.files[0] : event.target.value;
    if (name === "file") {
      const fileNameArr = value.name.split(".");
      const extension = fileNameArr[fileNameArr.length - 1]
      readFileContent(value)
        .then((content) => {
          setValues({
            ...values,
            fileType: fileTypesDictionary[extension],
            pastedCode: content,
            formData: new FormData(),
          });
        })
        .catch(() => console.error("Error in reading file!"));
    } else {
      setValues({ ...values, [name]: value, formData: new FormData()});
    }
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
        <Col lg={6} md={12}>
          <div className="create_post_div">
            <Row className="top_row">
              <input
                type="text"
                placeholder="Post Title"
                name="title"
                value={title}
                onChange={handleChange("title")}
                className="title_input"
              />
            </Row>
            <Row
              style={{
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Form.Check
                type="radio"
                label="Upload From File"
                name="codeInputRadio"
                id="fileInputRadio"
                style={{
                  margin: "0.2em 0.4em",
                }}
                onClick={() => setCodeInput("file")}
              />
              <Form.Check
                type="radio"
                label="Paste the Code"
                name="codeInputRadio"
                id="pasteInputRadio"
                style={{
                  margin: "0.2em 0.4em",
                }}
                defaultChecked={true}
                onClick={() => {
                  setCodeInput("paste");
                }}
              />
            </Row>
            {codeInput === "file" ? (
              <Row className="top_row">
                <div className="file_input_div">
                  <input
                    onChange={handleChange("file")}
                    type="file"
                    name="code_file"
                    accept="html|htm|css|js|jsx|ts|tsx|py|java|cpp|json|php"
                    placeholder="Choose a file"
                    className="file_input"
                  />
                </div>
              </Row>
            ) : (
              <Row className="top_row">
                <div>
                  <Form.Control
                    as="select"
                    value={fileType}
                    onChange={(e) =>
                      setValues({ ...values, fileType: e.target.value })
                    }
                    custom
                  >
                    <option value="">File Type</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                    <option value="javascript">Javascript</option>
                    <option value="typescript">Typescript</option>
                    <option value="php">PHP</option>
                  </Form.Control>
                </div>
                <div
                  className="file_input_div"
                  style={{ width: "100%", margin: "0.8em auto" }}
                >
                  <textarea
                    onChange={(e) =>
                      setValues({ ...values, pastedCode: e.target.value })
                    }
                    style={{ fontSize: "16px", fontFamily: "monospace" }}
                    placeholder="Paste your code here..."
                    type="text"
                    value={pastedCode}
                    name="pasted_code"
                    className="body_input"
                  />
                </div>
              </Row>
            )}
            <Row>
              <textarea
                type="text"
                placeholder="Description"
                name="body"
                value={body}
                onChange={handleChange("body")}
                className="body_input"
              />
            </Row>
          </div>
          <Button
            className="create_post_button"
            onClick={postData}
            disabled={disableUpdatePost}
          >
            POST
          </Button>
        </Col>

        {pastedCode && (
          <Col lg={6} md={12}>
            <SyntaxHighlighter
              language={fileType}
              style={dracula}
              showLineNumbers
            >
              {pastedCode}
            </SyntaxHighlighter>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default UpdatePost;