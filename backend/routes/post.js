const express = require("express");
const router = express.Router();
//Functions importing------------
const { isAuthenticated, isSignedIn, isAdmin } = require("../controllers/auth");
const {
  createPost,
  getMyPosts,
  getAllPost,
  getPostById,
  removePost,
  updatePost,
  getPost,
  likePost,
  unLikePost,
  commentOnPost,
  getMyFollowingPosts,
} = require("../controllers/post");
const { getUserById, getOtherUserById } = require("../controllers/user");


//-------------------------
//PARAMS
//-------------------------
router.param("userId", getUserById);
router.param("postId", getPostById);
router.param("otherUserId", getOtherUserById);


//-------------------------
//ROUTES
//-------------------------

//Create Post----------------
router.post("/post/create/:userId", isSignedIn, isAuthenticated, createPost);

//Get only My All Post----------------
router.get("/post/mypost/:userId", isSignedIn, isAuthenticated, getMyPosts);

//Get Single Post----------------
router.get(
  "/post/singlepost/:userId/:postId",
  isSignedIn,
  isAuthenticated,
  getPost
);

//Get Post of My Followings----------------
router.get(
  "/post/following/:userId",
  isSignedIn,
  isAuthenticated,
  getMyFollowingPosts
);

//Get All Posts----------------
router.get(
  "/post/allpost/:userId", 
  isSignedIn, 
  isAuthenticated, 
  getAllPost
);

//Delete Post----------------
router.delete(
  "/post/delete/:userId/:postId",
  isSignedIn,
  isAuthenticated,
  removePost
);

//Update Post----------------
router.put(
  "/post/update/:userId/:postId",
  isSignedIn,
  isAuthenticated,
  updatePost
);

//Like a Post----------------
router.put("/post/like/:userId", isSignedIn, isAuthenticated, likePost);

//Unlike a Post----------------
router.put("/post/unlike/:userId", isSignedIn, isAuthenticated, unLikePost);

//Comment Route----------------
router.put("/post/comment/:userId", isSignedIn, isAuthenticated, commentOnPost);

module.exports = router;