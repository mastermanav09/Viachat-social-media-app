import React, { useEffect, useState } from "react";
import classes from "./ScreamsList.module.scss";
import SkeletonScream from "../UI/skeletons/SkeletonScream";
import Scream from "./Scream";
import { useSelector, useDispatch } from "react-redux";
import { getScreams } from "../../store/reducers/data";
import { useNavigate } from "react-router-dom";
import { HOME_SCREAM } from "../../utils/constants";

const ScreamsList = (props) => {
  const dispatch = useDispatch();
  const uiState = useSelector((state) => state.ui);
  const screams = useSelector((state) => state.data.screams);
  const userState = useSelector((state) => state.user);
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userState.tokenExpiryState * 1000 < Date.now()) {
      navigate("/login", { replace: true });
    }
  }, []);

  console.log(screams);
  useEffect(() => {
    dispatch(getScreams());

    if (uiState.errors) {
      if (!uiState.errors.errorData) {
        setErrors("Something went wrong.");
      }
    }
  }, [dispatch]);

  if (!screams) {
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
    screams.length === 0 ? (
      <p className={classes.no_screams}>No screams found.</p>
    ) : (
      <>
        {screams.map((scream) => {
          return (
            <Scream
              key={scream._id}
              scream={scream}
              isLikedScream={isLikedScream(scream._id) ? true : false}
              socket={props.socket}
              type={HOME_SCREAM}
            />
          );
        })}
      </>
    );

  if (errors) {
    content = <p className={classes.validate}>{errors}</p>;
  }

  return <>{content}</>;
};

export default ScreamsList;
