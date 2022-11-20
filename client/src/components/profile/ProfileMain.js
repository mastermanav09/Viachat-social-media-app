import React from "react";
import { useEffect } from "react";
import classes from "./ProfileMain.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { uiActions } from "../../store/reducers/ui";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../UI/LoadingSpinner";
import { getUser } from "../../store/reducers/data";
import Modal from "../UI/Modal";
import EditProfile from "./EditProfile";
import UpdateProfilePicture from "./UpdateProfilePicture";
import Scream from "../scream/Scream";
import { useState } from "react";
import {
  EDIT_PROFILE,
  PROFILE_SCREAM,
  RAND_USER_SCREAM,
  UPDATE_PROFILE_PIC,
} from "../../utils/constants";
import Chat from "../svg/Chat";
import { addNewConversation } from "../../store/reducers/user";
import linkValidation from "../../utils/linkValidation";

const ProfileMain = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { socket } = props;
  const showProfileEditModal = useSelector(
    (state) => state.ui.showProfileEditModal
  );
  const showUpdateProfilePictureModal = useSelector(
    (state) => state.ui.showUpdateProfilePictureModal
  );
  const userState = useSelector((state) => state.user);
  const currentUserDataState = useSelector((state) => state.data);

  const params = useParams();
  const userId = params.userId;
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (props.myProfile) {
      setUserData(userState);
    } else {
      setUserData(currentUserDataState.currentUser);
    }
  }, [currentUserDataState.currentUser, props.myProfile, userState, dispatch]);

  useEffect(() => {
    if (!props.myProfile) {
      if (!userId) {
        navigate("/error");
        return;
      }

      dispatch(getUser({ userId }));
      localStorage.setItem("target", "/users/" + userId);
    } else {
      localStorage.setItem("target", "/my-profile");
    }
  }, [dispatch, props.myProfile, userId]);

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

  const createConversationHandler = () => {
    dispatch(addNewConversation({ receiverId: userId, navigate, socket }));
  };

  return (
    <>
      {showProfileEditModal && (
        <Modal type={EDIT_PROFILE}>
          <EditProfile
            currentUserId={userState.userId}
            myProfile={props.myProfile}
          />
        </Modal>
      )}

      {showUpdateProfilePictureModal && (
        <Modal type={UPDATE_PROFILE_PIC}>
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
              <div className={classes["profile-options"]}>
                {userState.userId === userData.userId ? (
                  <div className={classes["profile-options-first"]}>
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
                ) : (
                  <div className={classes["profile-options-two"]}>
                    <div
                      className={classes["profile-option-3"]}
                      onClick={createConversationHandler}
                    >
                      <span>
                        <Chat />
                      </span>
                      Chat
                    </div>
                  </div>
                )}
              </div>

              <div className={classes["profile-img-container"]}>
                {userData.credentials.imageUrl ? (
                  <img
                    src={
                      linkValidation(userData.credentials.imageUrl)
                        ? userData.credentials.imageUrl
                        : process.env.REACT_APP_ENDPOINT +
                          "/" +
                          userData.credentials.imageUrl
                    }
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
                {props.myProfile
                  ? "My"
                  : userData.credentials.name.split(" ").shift() + "'s"}{" "}
                Screams
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
                            props.myProfile ? PROFILE_SCREAM : RAND_USER_SCREAM
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
