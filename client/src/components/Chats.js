import React from "react";
import classes from "./Chats.module.scss";
import { useSelector } from "react-redux";
import { CHATS_BAR_MOBILE } from "../utils/constants";
import Cross from "./svg/Cross";

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
      <div className={`${classes["chats-wrapper"]}`}>GOLA</div>
    </div>
  );
};

export default Chats;
