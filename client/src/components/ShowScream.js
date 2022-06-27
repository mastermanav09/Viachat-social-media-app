import React, { useEffect, useState } from "react";
import Modal from "./UI/Modal";
import classes from "./ShowScream.module.scss";

import LoadingSpinner from "./UI/LoadingSpinner";
import ScreamInfo from "./ScreamInfo";
import { getScream } from "../store/reducers/data";
import { useDispatch, useSelector } from "react-redux";

const ShowScream = (props) => {
  const screamData = useSelector((state) => state.data.currentScreamData);
  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    async function getScreamHandler() {
      let likeStatus;

      if (
        userState.interactions.likes &&
        userState.interactions.likes.find(
          (like) => like.screamId === props.screamId
        )
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
    <Modal type="show-scream">
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
