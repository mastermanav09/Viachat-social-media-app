import React, { useEffect } from "react";
import MainNavigation from "./MainNavigation";
import { uiActions } from "../../store/reducers/ui";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const Layout = (props) => {
  const dispatch = useDispatch();
  const uiState = useSelector((state) => state.ui);

  useEffect(() => {
    const bodyWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;

    if (
      uiState.showScreamModal ||
      uiState.showProfileEditModal ||
      uiState.showPostScreamModal ||
      uiState.showSideBar ||
      uiState.showChatPanel ||
      (uiState.showNotifications && bodyWidth <= 640)
    ) {
      document.querySelector("body").style.overflow = "hidden";
    } else {
      document.querySelector("body").style.overflow = "";
    }
  }, [
    uiState.showScreamModal,
    uiState.showProfileEditModal,
    uiState.showPostScreamModal,
    uiState.showSideBar,
    uiState.showNotifications,
    uiState.showChatPanel,
  ]);

  return (
    <div>
      <MainNavigation socket={props.socket} />
      <main
        style={{ minHeight: "calc(100vh - 65px)", overflow: "auto" }}
        onClick={() => dispatch(uiActions.clearBars())}
      >
        {props.children}
      </main>
    </div>
  );
};

export default Layout;
