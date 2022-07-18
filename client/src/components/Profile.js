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
  const currentUserData = useSelector((state) =>
    props.myProfile ? state.user : state.data.currentUser
  );
  const location = useLocation();
  const userState = useSelector((state) => state.user);
  const userId = searchParams.get("id");

  useEffect(() => {
    if (!props.myProfile) {
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
    if (currentUserData.userId !== userState.userId) {
      return;
    }

    dispatch(uiActions.showProfileEditModal());
  };

  const showProfilePictureHandler = () => {
    if (currentUserData.userId !== userState.userId) {
      return;
    }

    dispatch(uiActions.showUpdateProfilePictureModal());
  };

  return (
    <>
      {uiState.showProfileEditModal && (
        <Modal type="edit-profile">
          <EditProfile
            currentUserId={currentUserData.userId}
            myProfile={props.myProfile}
          />
        </Modal>
      )}

      {uiState.showUpdateProfilePictureModal && (
        <Modal type="update-profile-picture">
          <UpdateProfilePicture currentUserId={currentUserData.userId} />
        </Modal>
      )}
      <>
        {uiState.loader || !currentUserData ? (
          <div className={classes["center"]}>
            <LoadingSpinner />
          </div>
        ) : (
          <div>
            <div className={classes["profile-background"]}>
              {userState.authenticated &&
                userState.userId === currentUserData.userId && (
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
                )}

              <div className={classes["profile-img-container"]}>
                {currentUserData.credentials.imageUrl ? (
                  <img
                    src={currentUserData.credentials.imageUrl}
                    alt="profile-pic"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <img src="/images/no-img.png" alt="profile-pic" />
                )}
              </div>
            </div>
            <div className={classes["profile-username"]}>
              {currentUserData.credentials.name}
            </div>
          </div>
        )}
      </>
    </>
  );
};

export default Profile;
