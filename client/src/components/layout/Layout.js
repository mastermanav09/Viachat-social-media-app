import React from "react";
import MainNavigation from "./MainNavigation";
import { uiActions } from "../../store/reducers/ui";
import { useDispatch } from "react-redux";

const Layout = (props) => {
  const dispatch = useDispatch();

  return (
    <>
      <MainNavigation />
      <main
        style={{ minHeight: "calc(100vh - 65px)" }}
        onClick={() => dispatch(uiActions.clearBars())}
      >
        {props.children}
      </main>
    </>
  );
};

export default Layout;
