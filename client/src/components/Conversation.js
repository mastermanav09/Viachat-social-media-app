import React, { useEffect, useState } from "react";
import classes from "./Conversation.module.scss";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { uiActions } from "../store/reducers/ui";
import { dataActions } from "../store/reducers/data";
import { useParams } from "react-router-dom";
import { userActions } from "../store/reducers/user";

const Conversation = (props) => {
  const dispatch = useDispatch();
  const { user, conversation } = props;
  const [recentMessage, setRecentMessage] = useState(
    conversation?.recentMessage || ""
  );
  const { socket } = props;
  const params = useParams();

  useEffect(() => {
    socket.on("getRecentMessage", (data) => {
      if (data?.conversationId === conversation._id) {
        setRecentMessage(data.text);
        dispatch(
          userActions.updateConversation({
            conversationId: data.conversationId,
            text: data.text,
          })
        );
      }
    });
  }, [socket, conversation._id, dispatch]);

  useEffect(() => {
    if (conversation._id === params.conversationId) {
      dispatch(dataActions.setcurrentConversation(conversation));
    }
  }, [params.conversationId, dispatch]);

  return (
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
          <div className={classes["recent-message"]}>{recentMessage}</div>
        </div>
      </div>
    </NavLink>
  );
};

export default React.memo(Conversation);
