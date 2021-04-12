import React from "react";
import { API } from "../backend";
//Function importing-----------------
import { isAuthenticated } from "../auth/helper";

const ProfilePhoto = (props) => {
  const { user } = isAuthenticated();

  const profileImageApi = `${API}/user/profile_photo/${user._id}/${props.photoId}`;
  const imageUrl = props.isPhoto
    ? profileImageApi
    : "https://www.flaticon.com/svg/static/icons/svg/2922/2922506.svg";

  return <img src={imageUrl} alt="profile_photo" style={props.css} />;
};

export default ProfilePhoto;