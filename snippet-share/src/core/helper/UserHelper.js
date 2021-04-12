import { API } from "../../backend";
import  axios  from "axios";

//Get Profile of ANY user-------------------
export const getProfileOfUser = (userId, otherUserId, token) => {
    return axios({
      method: "GET",
      url: `${API}/otheruser/${userId}/${otherUserId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .catch((err) => console.log(err));
}

//Follow a User-------------------
export const followAUser = (userId, token, followId) => {
    return axios({
      method: "PUT",
      url: `${API}/user/follow/${userId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify({
        followId: followId,
      }),
    })
    .catch((err) => console.log(err));    
} 

//UnFollow a User-------------------
export const unFollowAUser = (userId, token, unfollowId) => {
    return axios({
      method: "PUT",
      url: `${API}/user/unfollow/${userId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify({
        unFollowId: unfollowId,
      }),
    })
    .catch((err) => console.log(err));    
}

//Add/Edit Profile Photo-------------------
export const addEditProfilePhoto = (userId, token, formData) => {
    return axios({
      method: "POST",
      url: `${API}/user/add/profile_photo/${userId}`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: formData,
    })
    .catch((err) => console.log(err));
}