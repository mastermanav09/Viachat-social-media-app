import React, { useEffect } from "react";
import classes from "./Profile.module.scss";
import { useSearchParams } from "react-router-dom";
import { uiActions } from "../store/reducers/ui";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "./UI/LoadingSpinner";
import { getUser } from "../store/reducers/data";
import Modal from "./UI/Modal";
import EditProfile from "./EditProfile";
import { useLocation } from "react-router-dom";
import UpdateProfilePicture from "./UpdateProfilePicture";

const Profile = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const uiState = useSelector((state) => state.ui);
  const userData = useSelector((state) =>
    props.myProfile ? state.user : state.data.currentUser
  );
  const location = useLocation();

  useEffect(() => {
    if (!props.myProfile) {
      const userId = searchParams.get("id");
      if (userId) {
        dispatch(getUser({ userId: userId }));
      }
      if (location.search) {
        localStorage.setItem("target", location.pathname + location.search);
      }
    } else {
      localStorage.setItem("target", location.pathname);
    }
  }, [dispatch, props.myProfile, searchParams]);

  const showEditOptionsHandler = () => {
    dispatch(uiActions.showProfileEditModal());
  };

  const showProfilePictureHandler = () => {
    dispatch(uiActions.showUpdateProfilePictureModal());
  };

  return (
    <>
      {uiState.showProfileEditModal && (
        <Modal type="edit-profile">
          <EditProfile />
        </Modal>
      )}

      {uiState.showUpdateProfilePictureModal && (
        <Modal type="update-profile-picture">
          <UpdateProfilePicture />
        </Modal>
      )}
      <>
        {uiState.loader || !userData ? (
          <div className={classes["center"]}>
            <LoadingSpinner />
          </div>
        ) : (
          <div>
            <div className={classes["profile-background"]}>
              <div className={classes["profile-options"]}>
                <div className={classes["profile-options-inner"]}>
                  <div
                    className={classes["profile-option-1"]}
                    onClick={showEditOptionsHandler}
                  >
                    Edit profile
                  </div>
                  <div
                    className={classes["profile-option-2"]}
                    onClick={showProfilePictureHandler}
                  >
                    Update picture
                  </div>
                </div>
              </div>
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
    </>
  );
};

export default Profile;
