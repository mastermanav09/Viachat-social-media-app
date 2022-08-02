import React from "react";
import { Outlet } from "react-router-dom";
import ProfileMain from "./ProfileMain";

const Profile = (props) => {
  return (
    <>
      <Outlet />
      <ProfileMain myProfile={props.myProfile} socket={props.myProfile} />
    </>
  );
};

export default Profile;
