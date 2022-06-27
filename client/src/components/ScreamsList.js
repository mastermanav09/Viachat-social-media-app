import React, { useEffect, useState } from "react";
import classes from "./ScreamsList.module.scss";
import SkeletonScream from "./UI/skeletons/SkeletonScream";
import Scream from "./Scream";
import { useSelector, useDispatch } from "react-redux";
import { getScreams } from "../store/reducers/data";
import { useNavigate } from "react-router-dom";

const ScreamsList = (props) => {
  const dispatch = useDispatch();
  const uiState = useSelector((state) => state.ui);
  const dataState = useSelector((state) => state.data);
  const userState = useSelector((state) => state.user);
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userState.tokenExpiryState * 1000 < Date.now()) {
      navigate("/login", { replace: true });
    }
  }, []);

  useEffect(() => {
    if (!dataState.screams) {
      dispatch(getScreams());
      if (uiState.errors) {
        if (!uiState.errors.errorData) {
          setErrors("Something went wrong.");
        }
      }
    }
  }, [dispatch, uiState.errors]);

  if (!dataState.screams) {
    let content;
    content = [1, 2, 3, 4].map((n) => <SkeletonScream key={n} />);
    return content;
  }

  const isLikedScream = (id) => {
    if (
      userState.interactions.likes &&
      userState.interactions.likes.find((like) => like.screamId === id)
    ) {
      return true;
    }

    return false;
  };

  let content =
    dataState.screams.length === 0 ? (
      <p className={classes.no_screams}>No screams found.</p>
    ) : (
      <>
        {dataState.screams.map((scream) => (
          <Scream
            key={scream._id}
            scream={scream}
            isLikedScream={isLikedScream(scream._id) ? true : false}
            socket={props.socket}
          />
        ))}
      </>
    );

  if (errors) {
    content = <p className={classes.validate}>{errors}</p>;
  }

  return <>{content}</>;
};

export default React.memo(ScreamsList);
