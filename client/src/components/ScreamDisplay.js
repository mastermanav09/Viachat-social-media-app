import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getScream } from "../store/reducers/data";
import { useParams } from "react-router-dom";
import ShowScream from "./ShowScream";
import { uiActions } from "../store/reducers/ui";
import { useNavigate } from "react-router-dom";

const ScreamDisplay = (props) => {
  const dispatch = useDispatch();
  const params = useParams();
  const { screamId } = params;
  const userState = useSelector((state) => state.user);
  const uistate = useSelector((state) => state.ui);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(uiActions.showScreamModal());
  }, [dispatch]);

  // useEffect(() => {
  //   async function getScreamHandler() {
  //     if (!uistate.showScreamModal) {
  //       let likeStatus;
  //       setTimeout(async () => {
  //         if (
  //           userState.interactions.likes &&
  //           userState.interactions.likes.find(
  //             (like) => like.screamId === screamId
  //           )
  //         ) {
  //           likeStatus = true;
  //         } else {
  //           likeStatus = false;
  //         }

  //         await dispatch(
  //           getScream({
  //             id: screamId,
  //             likeStatus: likeStatus,
  //           })
  //         );
  //       }, 180);
  //     }
  //   }

  //   getScreamHandler();
  // }, [dispatch, screamId]);

  return (
    <>
      {userState.interactions.likes && (
        <ShowScream socket={props.socket} screamId={screamId} />
      )}
    </>
  );
};

export default ScreamDisplay;
