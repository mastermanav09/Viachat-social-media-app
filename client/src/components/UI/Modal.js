import React from "react";
import ReactDOM from "react-dom";
import classes from "./Modal.module.scss";
import Cross from "../svg/Cross";
import { uiActions } from "../../store/reducers/ui";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Backdrop = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const uiState = useSelector((state) => state.ui);

  return (
    <div
      className={classes.backdrop}
      onClick={() => {
        dispatch(uiActions.closeModal());
        navigate("/");
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
      {ReactDOM.createPortal(<Backdrop />, document.getElementById("overlay"))}
      {ReactDOM.createPortal(
        <ModalOverlay type={props.type}>
          <Cross />
          {props.children}
        </ModalOverlay>,
        document.getElementById("overlay")
      )}
    </>
  );
};

export default Modal;
