import React from "react";
import ReactDOM from "react-dom";
import classes from "./Modal.module.scss";
import Cross from "../svg/Cross";
import { uiActions } from "../../store/reducers/ui";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ADD_SCREAM,
  EDIT_PROFILE,
  UPDATE_PROFILE_PIC,
  SHOW_SCREAM,
  RAND_USER_SCREAM,
} from "../../utils/constants";

const Backdrop = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div
      className={classes.backdrop}
      onClick={() => {
        dispatch(uiActions.closeModal());

        if (props.type === UPDATE_PROFILE_PIC || props.type === EDIT_PROFILE) {
          navigate("/my-profile");
          return;
        }

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
      }}
    ></div>
  );
};

const ModalOverlay = (props) => {
  return (
    <div className={`${classes[props.type]}  ${classes.modal}`}>
      <div className={classes["wrapper"]}>{props.children}</div>
    </div>
  );
};

const Modal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop type={props.type} />,
        document.getElementById("overlay")
      )}
      {ReactDOM.createPortal(
        <ModalOverlay type={props.type}>
          <Cross type={props.type} />
          {props.children}
        </ModalOverlay>,
        document.getElementById("overlay")
      )}
    </>
  );
};

export default Modal;
