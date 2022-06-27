import React, { useEffect } from "react";
import MainNavigation from "./MainNavigation";
import { uiActions } from "../../store/reducers/ui";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const Layout = (props) => {
  const dispatch = useDispatch();
  const uiState = useSelector((state) => state.ui);

  useEffect(() => {
    if (
      uiState.showScreamModal ||
      uiState.showProfileEditModal ||
      uiState.showPostScreamModal
    ) {
      document.querySelector("body").style.overflow = "hidden";
    } else {
      document.querySelector("body").style.overflow = "auto";
    }
  }, [
    uiState.showScreamModal,
    uiState.showProfileEditModal,
    uiState.showPostScreamModal,
  ]);

  return (
    <div>
      <MainNavigation socket={props.socket} />
      <main
        style={{ minHeight: "calc(100vh - 65px)" }}
        onClick={() => dispatch(uiActions.clearBars())}
      >
        {props.children}
      </main>
    </div>
  );
};

export default Layout;
