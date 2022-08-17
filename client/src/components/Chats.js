import React from "react";
import classes from "./Chats.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { CHATS_BAR_MOBILE } from "../utils/constants";
import Cross from "./svg/Cross";
import { Link } from "react-router-dom";

const Chats = () => {
  const uiState = useSelector((state) => state.ui);

  return (
    <div
      className={[
        classes.chats,
        uiState.showChats ? classes["open"] : classes["close"],
      ].join(" ")}
    >
      <div className={classes["close"]}>
        <Cross type={CHATS_BAR_MOBILE} />
      </div>
      <Link to="/my-profile/chats" className={`${classes["chats-wrapper"]}`}>
        GOLA
      </Link>
    </div>
  );
};

export default Chats;
