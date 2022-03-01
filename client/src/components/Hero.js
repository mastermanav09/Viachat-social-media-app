import React, { useEffect } from "react";
import classes from "./Hero.module.scss";
import SkeletonProfile from "./UI/skeletons/SkeletonProfile";
import Card from "./UI/Card";
import { Link } from "react-router-dom";
import Location from "./svg/Location";
import Calender from "./svg/Calender";
import WebsiteLink from "./svg/WebsiteLink";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../store/reducers/user";

const Hero = () => {
  const userCredentials = useSelector((state) => state.user.credentials);
  const joinedDate = new Date(userCredentials.joined);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, []);

  if (Object.keys(userCredentials).length === 0) {
    return <SkeletonProfile />;
  }

  return (
    <Card type="profile">
      <div className={classes.profile}>
        <div className={`${classes["upper-container"]}`}>
          <div className={`${classes["image-container"]}`}>
            <img src={"/" + userCredentials.imageUrl} alt="picture" />
          </div>
        </div>
        <div className={`${classes["lower-container"]}`}>
          <div className={`${classes["profile-link"]}`}>
            <Link to="/my-profile">@{userCredentials.username}</Link>
          </div>
          <div className={classes.name}>{userCredentials.name}</div>
          <div className={classes.intro}>Hello, I'm user</div>
          {!userCredentials.location && (
            <div className={classes.location}>
              <Location /> New Delhi, India
            </div>
          )}

          {!userCredentials.website && (
            <div className={classes.website}>
              <WebsiteLink />
              <a
                href="https://facebook.com"
                target="_blank"
                style={{ margin: "0" }}
              >
                https://facebook.com
              </a>
            </div>
          )}

          <div className={classes.joined}>
            <Calender />
            Joined
            <span>
              {joinedDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Hero;
