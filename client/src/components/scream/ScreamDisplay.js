import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ShowScream from "./ShowScream";

const ScreamDisplay = (props) => {
  const params = useParams();
  const { screamId } = params;
  const userState = useSelector((state) => state.user);

  return (
    <>
      {userState.interactions.likes && (
        <ShowScream socket={props.socket} screamId={screamId} />
      )}
    </>
  );
};

export default ScreamDisplay;
