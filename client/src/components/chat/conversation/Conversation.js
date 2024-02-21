import React, { useEffect, useState } from "react";
import classes from "./Conversation.module.scss";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { dataActions } from "../../../store/reducers/data";
import { useParams } from "react-router-dom";

const Conversation = (props) => {
  const dispatch = useDispatch();
  const { user, conversation } = props;
  const [isMounted, setIsMounted] = useState(false);
  const params = useParams();

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (conversation._id === params.conversationId) {
      dispatch(dataActions.setcurrentConversation(conversation));
    }
  }, [params.conversationId, dispatch, conversation]);

  if (!isMounted) {
    return <></>;
  }

  return (
    <>
      {isMounted && (
        <NavLink
          to={`/my-profile/chats/${conversation._id}`}
          className={(navData) => {
            return navData.isActive
              ? `${classes.isActive} ${classes.chat}`
              : `${classes.isInActive} ${classes.chat}`;
          }}
        >
          <div className={`${classes["chat-item"]}`}>
            <div className={`${classes["image-container"]}`}>
              {user.userImageUrl ? (
                <img
                  src={user.userImageUrl}
                  alt="profile-icon"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <img
                  src="/images/no-img.png"
                  alt="profile-icon"
                  referrerPolicy="no-referrer"
                />
              )}

              {props.isOnline && <div className={classes["online-badge"]} />}
            </div>

            <div className={`${classes["lower-container"]}`}>
              <p className={`${classes["user-name"]}`}>{user.userName}</p>
              <div className={classes["recent-message"]}>
                {conversation.recentMessage}
              </div>
            </div>
          </div>
        </NavLink>
      )}
    </>
  );
};

export default Conversation;
