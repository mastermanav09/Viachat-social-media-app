import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../store/reducers/ui";
import { useNavigate } from "react-router-dom";
import classes from "./Cross.module.scss";
import {
  NOTIFICATION_BAR_MOBILE,
  SIDEBAR_MOBILE,
  PROFILE_SCREAM,
  RAND_USER_SCREAM,
  EDIT_PROFILE,
  UPDATE_PROFILE_PIC,
  SIDEBAR,
  CHATS_BAR_MOBILE,
  ADD_SCREAM,
  SHOW_SCREAM,
} from "../../utils/constants";

const Cross = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <span
      className={classes["cross"]}
      onClick={() => {
        dispatch(uiActions.closeModal());

        if (props.type === SHOW_SCREAM || props.type === RAND_USER_SCREAM) {
          let target = localStorage.getItem("target");
          if (target) {
            navigate(target);
          } else {
            navigate("/");
          }
          return;
        }

        if (props.type === ADD_SCREAM) {
          navigate("/");
          return;
        }

        if (props.type === UPDATE_PROFILE_PIC || props.type === EDIT_PROFILE) {
          navigate("/my-profile");
          return;
        }

        if (props.type === NOTIFICATION_BAR_MOBILE) {
          dispatch(uiActions.showNotifications(false));
          return;
        }

        if (props.type === SIDEBAR_MOBILE) {
          dispatch(uiActions.setSideBar(false));
        }
      }}
    >
      <svg
        x="0px"
        y="0px"
        width="18px"
        height="18px"
        viewBox="0 0 94.926 94.926"
        style={{ fill: "white" }}
      >
        <g>
          <path d="M55.931,47.463L94.306,9.09c0.826-0.827,0.826-2.167,0-2.994L88.833,0.62C88.436,0.224,87.896,0,87.335,0   c-0.562,0-1.101,0.224-1.498,0.62L47.463,38.994L9.089,0.62c-0.795-0.795-2.202-0.794-2.995,0L0.622,6.096   c-0.827,0.827-0.827,2.167,0,2.994l38.374,38.373L0.622,85.836c-0.827,0.827-0.827,2.167,0,2.994l5.473,5.476   c0.397,0.396,0.936,0.62,1.498,0.62s1.1-0.224,1.497-0.62l38.374-38.374l38.374,38.374c0.397,0.396,0.937,0.62,1.498,0.62   s1.101-0.224,1.498-0.62l5.473-5.476c0.826-0.827,0.826-2.167,0-2.994L55.931,47.463z" />
        </g>
      </svg>
    </span>
  );
};

export default Cross;
