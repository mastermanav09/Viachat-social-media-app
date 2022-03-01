import React, { useEffect, useState } from "react";
import classes from "./ScreamsList.module.scss";
import SkeletonScream from "./UI/skeletons/SkeletonScream";
import Scream from "./Scream";
import { useSelector, useDispatch } from "react-redux";
import { getScreams } from "../store/reducers/data";

const ScreamsList = () => {
  const dispatch = useDispatch();
  const uiState = useSelector((state) => state.ui);
  const dataState = useSelector((state) => state.data);

  useEffect(() => {
    dispatch(getScreams());
  }, []);

  if (uiState.errors) {
    return (
      <p className={classes.validate}>
        {uiState.errors.message || <>Something went wrong.</>}
      </p>
    );
  }

  if (!dataState.screams) {
    let content;
    content = [1, 2, 3, 4].map((n) => <SkeletonScream key={n} />);
    return content;
  }

  return (
    <>
      {dataState.screams.length === 0 ? (
        <p className={classes.no_screams}>No screams found.</p>
      ) : (
        <>
          {dataState.screams.map((scream) => (
            <Scream key={scream._id} scream={scream} />
          ))}
        </>
      )}
    </>
  );
};

export default ScreamsList;
