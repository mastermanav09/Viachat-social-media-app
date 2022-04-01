import React, { useEffect } from "react";
import classes from "./Profile.module.scss";
import { useSearchParams } from "react-router-dom";
import { uiActions } from "../store/reducers/ui";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "./UI/LoadingSpinner";
import { getUser } from "../store/reducers/data";

const Profile = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const loader = useSelector((state) => state.ui.loader);
  const userData = useSelector((state) =>
    props.myProfile ? state.user : state.data.currentUser
  );

  useEffect(() => {
    if (!props.myProfile) {
      const userId = searchParams.get("id");
      if (userId) {
        dispatch(getUser({ userId: userId }));
      }
    }
  }, []);

  return (
    <>
      {loader || !userData ? (
        <div className={classes["center"]}>
          <LoadingSpinner />
        </div>
      ) : (
        <div>
          <div className={classes["profile-background"]}>
            <div className={classes["profile-img-container"]}>
              {userData.credentials.imageUrl ? (
                <img
                  src={userData.credentials.imageUrl}
                  alt="profile-pic"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <img src="/images/no-img.png" alt="profile-pic" />
              )}
            </div>
          </div>
          <div className={classes["profile-username"]}>
            {userData.credentials.name}
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
