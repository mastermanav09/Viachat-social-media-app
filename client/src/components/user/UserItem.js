import React from "react";
import { NavLink } from "react-router-dom";
import classes from "./UserItem.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../store/reducers/ui";

const UserItem = (props) => {
  const { user } = props;
  const myUserId = useSelector((state) => state.user.userId);
  const dispatch = useDispatch();

  return (
    <NavLink
      to={user._id === myUserId ? "/my-profile" : `/users/${user._id}`}
      onClick={() => dispatch(uiActions.showUserSearchBox(false))}
    >
      <div className={`${classes["user-item"]}`}>
        <div className={`${classes["image-container"]}`}>
          {user?.credentials.imageUrl ? (
            <img
              src={user.credentials.imageUrl}
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
          <p className={`${classes["user-name"]}`}>
            {user?.credentials.username}
          </p>
        </div>
      </div>
    </NavLink>

    // <NavLink to={`/users/${conversation._id}`}>
    //   <div className={`${classes["chat-item"]}`}>
    //     <div className={`${classes["image-container"]}`}>
    //       {user.userImageUrl ? (
    //         <img
    //           src={user.userImageUrl}
    //           alt="profile-icon"
    //           referrerPolicy="no-referrer"
    //         />
    //       ) : (
    //         <img
    //           src="/images/no-img.png"
    //           alt="profile-icon"
    //           referrerPolicy="no-referrer"
    //         />
    //       )}
    //     </div>

    //     <div className={`${classes["lower-container"]}`}>
    //       <p className={`${classes["user-name"]}`}>{user.userName}</p>
    //     </div>
    //   </div>
    // </NavLink>
  );
};

export default UserItem;
