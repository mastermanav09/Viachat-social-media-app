import React, { useEffect, useState } from "react";
import classes from "./Screams.module.scss";
import axios from "axios";
import Cookies from "universal-cookie";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const Screams = () => {
  const [screams, setScreams] = useState(null);
  const [error, setError] = useState(null);
  const cookies = new Cookies();

  useEffect(() => {
    setError(null);
    const token = cookies.get("upid");
    axios
      .get("/api/scream/screams", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        if (res.status !== 200 || res.statusText !== "OK") {
          const error = new Error("Can't load screams!");
          throw error;
        }

        console.log(res.data.screams);
        setScreams(res.data.screams);
      })
      .catch((error) => {
        setError(error.message);
        console.log(error);
      });
  }, []);

  if (error) {
    // return <p className={classes.center}>{error}</p>;
  }

  if (!screams) {
    return (
      <div className={`${classes.center} ${classes.middle}`}>
        <LoadingSpinner />
      </div>
    );
  }

  let content = screams.map((scream) => <p>{scream.body}</p>);

  return (
    <div>{screams.length == 0 ? <p>No screams found.</p> : <>{content}</>}</div>
  );
};

export default Screams;
