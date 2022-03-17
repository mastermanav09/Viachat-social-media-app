import React, { useEffect, useState } from "react";
import Modal from "./UI/Modal";
import classes from "./ShowScream.module.scss";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "./UI/LoadingSpinner";
import ScreamInfo from "./ScreamInfo";
import { useParams } from "react-router-dom";
import { getScream } from "../store/reducers/data";

const ShowScream = (props) => {
  const isLoading = useSelector((state) => state.ui.loader);
  const screamData = useSelector((state) => state.data.currentScreamData);
  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const uiState = useSelector((state) => state.ui);
  const params = useParams();
  const { screamId } = params;

  useEffect(() => {
    if (!uiState.showScreamModal) {
      let likeStatus;
      if (
        userState.interactions.likes &&
        userState.interactions.likes.find((like) => like.screamId === screamId)
      ) {
        likeStatus = true;
      } else {
        likeStatus = false;
      }

      dispatch(
        getScream({
          id: screamId,
          likeStatus: likeStatus,
        })
      );
    }
  }, [userState.interactions.likes]);

  return (
    <Modal type="show-scream">
      {!screamData || !userState.interactions.likes ? (
        <div className={classes["loading-spinner"]}>
          <LoadingSpinner />
        </div>
      ) : (
        <ScreamInfo socket={props.socket} />
      )}
    </Modal>
  );
};

export default ShowScream;
