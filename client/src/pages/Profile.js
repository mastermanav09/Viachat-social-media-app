import React from "react";
import UserProfile from "../components/profile/Profile";

const Profile = (props) => {
  return <UserProfile myProfile={props.myProfile} socket={props.socket} />;
};

export default Profile;
