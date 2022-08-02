import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getScream } from "../store/reducers/data";
import { useParams } from "react-router-dom";
import ShowScream from "./ShowScream";
import { uiActions } from "../store/reducers/ui";

const ScreamDisplay = (props) => {
  const dispatch = useDispatch();
  const params = useParams();
  const { screamId } = params;
  const userState = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(uiActions.showScreamModal());
  }, [dispatch]);

  return (
    <>
      {userState.interactions.likes && (
        <ShowScream socket={props.socket} screamId={screamId} />
      )}
    </>
  );
};

export default ScreamDisplay;
