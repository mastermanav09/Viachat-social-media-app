import React, { useEffect } from "react";
import classes from "./Conversation.module.scss";
import { format } from "timeago.js";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/reducers/ui";
import { dataActions } from "../store/reducers/data";
import { useParams } from "react-router-dom";

const Conversation = (props) => {
  const dispatch = useDispatch();
  const { user } = props;
  const manageChats = () => {
    dispatch(uiActions.closeModal());
  };
  const params = useParams();

  useEffect(() => {
    if (props.conversation._id === params.conversationId) {
      dispatch(dataActions.setcurrentConversation(props.conversation));
    }
  }, [params.conversationId, dispatch]);

  return (
    <NavLink
      to={`/my-profile/chats/${props.conversationId}`}
      // onClick={() => {
      //   manageChats();
      // }}
      className={classes["chat-link"]}
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
        </div>

        <div className={`${classes["lower-container"]}`}>
          <p className={`${classes["user-name"]}`}>{user.userName}</p>
        </div>
      </div>
    </NavLink>
  );
};

export default React.memo(Conversation);
