import axios from "axios";
import { API } from "../../backend";

//Create Post-------------------
export const createPost = (userId, token, post) => {
  return axios({
    method: "POST",
    url: `${API}/post/create/${userId}`,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: post,
  })
  .catch((err) => console.log(err));
};

//Update Post-------------------
export const updatePost = (userId, token, post, postId) => {
  return axios({
    method: "PUT",
    url: `${API}/post/update/${userId}/${postId}`,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: post,
  })
  .catch((err) => console.log(err));
};

//Delete Post-------------------
export const deleteAPost = (userId, token, postId) => {
  return axios({
    method: "DELETE",
    url: `${API}/post/delete/${userId}/${postId}`,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  .catch((err) => console.log(err));
}

//Get a Post-------------------
export const getAPost = (postId, userId, token) => {
  return axios({
    method: "GET",
    url: `${API}/post/singlepost/${userId}/${postId}`,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  .catch((err) => console.log(err));
};

//Get All Posts-------------------
export const getAllPost = (userId, token) => {
  return axios({
    method: "GET",
    url: `${API}/post/allpost/${userId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  .catch((err) => console.log(err));
}

//Get My Following Posts-------------------
export const getMyFollowingPost = (userId, token) => {
  return axios({
    method: "GET",
    url: `${API}/post/following/${userId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  .catch((err) => console.log(err));
}

//Like a Post-------------------
export const likeAPost = (userId, token, postId) => {
  return axios({
    method: "PUT",
    url: `${API}/post/like/${userId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: JSON.stringify({
      postId,
    }),
  })
  .catch((err) => console.log(err));
}

//UnLike a Post-------------------
export const unLikeAPost = (userId, token, postId) => {
  return axios({
    method: "PUT",
    url: `${API}/post/unlike/${userId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: JSON.stringify({
      postId,
    }),
  })
  .catch((err) => console.log(err));
}

//Comment on a Post-------------------
export const commentOnAPost = (userId, token, text, postId, postedById, contentType) => {
  return axios({
    method: "PUT",
    url: `${API}/post/comment/${userId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: JSON.stringify({
      text,
      postId,
      postedById,
      contentType,
    }),
  })
  .catch((err) => console.log(err)); 
}