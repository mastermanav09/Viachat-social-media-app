import React from "react";
import ReactDOM from "react-dom";
import classes from "./Modal.module.scss";
import Cross from "../svg/Cross";
import { uiActions } from "../../store/reducers/ui";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ADD_SCREAM,
  EDIT_PROFILE,
  PROFILE_SCREAM,
  RAND_USER_SCREAM,
  UPDATE_PROFILE_PIC,
} from "../../utils/constants";

const Backdrop = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const uiState = useSelector((state) => state.ui);

  return (
    <div
      className={classes.backdrop}
      onClick={() => {
        dispatch(uiActions.closeModal());

        if (uiState.showScreamIdentifier === PROFILE_SCREAM) {
          navigate("/my-profile");
          return;
        }

        if (uiState.showScreamIdentifier === RAND_USER_SCREAM) {
          navigate(-1);
          return;
        }

        if (props.type !== EDIT_PROFILE && props.type !== UPDATE_PROFILE_PIC) {
          navigate("/");
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
