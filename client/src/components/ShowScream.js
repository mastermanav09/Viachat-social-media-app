import React, { useEffect, useState } from "react";
import Modal from "./UI/Modal";
import classes from "./ShowScream.module.scss";

import LoadingSpinner from "./UI/LoadingSpinner";
import ScreamInfo from "./ScreamInfo";
import { getScream } from "../store/reducers/data";
import { useDispatch, useSelector } from "react-redux";
import { SHOW_SCREAM } from "../utils/constants";

const ShowScream = (props) => {
  const screamData = useSelector((state) => state.data.currentScreamData);
  const userLikes = useSelector((state) => state.user.interactions.likes);
  const uiState = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  useEffect(() => {
    async function getScreamHandler() {
      let likeStatus;

      if (
        userLikes &&
        userLikes.find((like) => like.screamId === props.screamId)
      ) {
        likeStatus = true;
      } else {
        likeStatus = false;
      }

      await dispatch(
        getScream({
          id: props.screamId,
          likeStatus: likeStatus,
        })
      );
    }

    getScreamHandler();
  }, []);

  return (
    <Modal
      type={
        uiState.showScreamIdentifier
          ? uiState.showScreamIdentifier
          : SHOW_SCREAM
      }
    >
      {!screamData ? (
        <div className={classes["loading-spinner"]}>
          <LoadingSpinner />
        </div>
      ) : (
        <ScreamInfo socket={props.socket} />
      )}
    </Modal>
  );
};

export default React.memo(ShowScream);
