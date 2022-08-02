import React from "react";
import { useEffect } from "react";
import classes from "./ProfileMain.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { uiActions } from "../store/reducers/ui";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "./UI/LoadingSpinner";
import { getUser } from "../store/reducers/data";
import Modal from "./UI/Modal";
import EditProfile from "./EditProfile";
import { useLocation } from "react-router-dom";
import UpdateProfilePicture from "./UpdateProfilePicture";
import Scream from "./Scream";
import { useState } from "react";

const ProfileMain = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showProfileEditModal = useSelector(
    (state) => state.ui.showProfileEditModal
  );
  const showUpdateProfilePictureModal = useSelector(
    (state) => state.ui.showUpdateProfilePictureModal
  );
  const userState = useSelector((state) => state.user);
  const currentUserDataState = useSelector((state) => state.data);

  const params = useParams();
  const location = useLocation();

  const userId = params.userId;
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (props.myProfile) {
      setUserData(userState);
    } else {
      setUserData(currentUserDataState.currentUser);
    }
  }, [
    currentUserDataState,
    currentUserDataState.currentUser,
    props.myProfile,
    userState,
  ]);

  useEffect(() => {
    if (!props.myProfile) {
      if (!userId) {
        navigate("/error");
        return;
      }

      dispatch(getUser({ userId }));

      if (location.search) {
        console.log(location.pathname + location.search);
        localStorage.setItem("target", location.pathname + location.search);
      }
    } else {
      localStorage.setItem("target", location.pathname);
    }
  }, [dispatch, props.myProfile]);

  const showEditOptionsHandler = () => {
    if (userData.userId !== userState.userId) {
      return;
    }

    dispatch(uiActions.showProfileEditModal());
  };

  const showProfilePictureHandler = () => {
    if (userData.userId !== userState.userId) {
      return;
    }

    dispatch(uiActions.showUpdateProfilePictureModal());
  };

  const isLikedScream = (id) => {
    if (
      userState.interactions.likes &&
      userState.interactions.likes.find((like) => like.screamId === id)
    ) {
      return true;
    }

    return false;
  };

  return (
    <>
      {showProfileEditModal && (
        <Modal type="edit-profile">
          <EditProfile
            currentUserId={userState.userId}
            myProfile={props.myProfile}
          />
        </Modal>
      )}

      {showUpdateProfilePictureModal && (
        <Modal type="update-profile-picture">
          <UpdateProfilePicture currentUserId={userState.userId} />
        </Modal>
      )}
      <>
        {!userData ? (
          <div className={classes["center"]}>
            <LoadingSpinner />
          </div>
        ) : (
          <div>
            <div className={classes["profile-background"]}>
              {userState.userId === userData.userId && (
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

            <div className={classes["profile-main"]}>
              <div className={classes["my-screams-block"]}>
                My Screams
                <div className={classes["divider"]} />
                <div className={classes["screams"]}>
                  {userData.screams.length === 0 ? (
                    <p className={classes.no_screams}>No screams found.</p>
                  ) : (
                    <>
                      {userData.screams.map((scream) => (
                        <Scream
                          key={scream._id}
                          scream={scream}
                          isLikedScream={
                            isLikedScream(scream._id) ? true : false
                          }
                          socket={props.socket}
                          type={
                            props.myProfile
                              ? "profile-scream"
                              : "random-user-scream"
                          }
                        />
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </>
  );
};

export default React.memo(ProfileMain);
