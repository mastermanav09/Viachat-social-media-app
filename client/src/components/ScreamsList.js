import React, { useEffect, useState } from "react";
import classes from "./ScreamsList.module.scss";
import axios from "axios";
import Cookies from "universal-cookie";
import SkeletonScream from "./UI/skeletons/SkeletonScream";
import Scream from "./Scream";

const ScreamsList = () => {
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

  // if (error) {
  //   return <p className={classes.center}>{error}</p>;
  // }

  if (!screams) {
    let content;
    content = [1, 2, 3, 4].map((n) => <SkeletonScream key={n} />);
    return content;
  }

  return (
    <>
      {screams.length === 0 ? (
        <p className={classes.no_screams}>No screams found.</p>
      ) : (
        <>
          {screams.map((scream) => (
            <Scream key={scream._id} scream={scream} />
          ))}
        </>
      )}
    </>
  );
};

export default ScreamsList;
