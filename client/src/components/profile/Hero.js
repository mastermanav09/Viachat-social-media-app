import React, { useEffect } from "react";
import classes from "./Hero.module.scss";
import SkeletonProfile from "../UI/skeletons/SkeletonProfile";
import Card from "../UI/Card";
import { Link } from "react-router-dom";
import Location from "../svg/Location";
import Calender from "../svg/Calender";
import WebsiteLink from "../svg/WebsiteLink";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../store/reducers/user";
import { PROFILE } from "../../utils/constants";

const Hero = () => {
  const userCredentials = useSelector((state) => state.user.credentials);
  const joinedDate = new Date(userCredentials.joined);
  const dispatch = useDispatch();

  useEffect(() => {
    if (Object.keys(userCredentials).length === 0) {
      dispatch(getUser());
    }
  }, [dispatch, userCredentials]);

  if (Object.keys(userCredentials).length === 0) {
    return <SkeletonProfile />;
  }

  let address;
  if (userCredentials.address && userCredentials.address.length > 30) {
    address = userCredentials.address.slice(0, 25) + "...";
  } else {
    address = userCredentials.address;
  }

  let bio;
  if (userCredentials.bio && userCredentials.bio.length > 30) {
    bio = userCredentials.bio.slice(0, 25) + "...";
  } else {
    bio = userCredentials.bio;
  }

  return (
    <Card type={PROFILE}>
      <div className={classes.profile}>
        <div className={`${classes["upper-container"]}`}>
          <div className={`${classes["image-container"]}`}>
            {userCredentials.imageUrl ? (
              <img
                src={userCredentials.imageUrl}
                referrerPolicy="no-referrer"
                alt="profile-pic"
              />
            ) : (
              <img src="/images/no-img.png" alt="profile-pic" />
            )}
          </div>
        </div>
        <div className={`${classes["lower-container"]}`}>
          <div className={`${classes["profile-link"]}`}>
            <Link to="/my-profile">@{userCredentials.username}</Link>
          </div>
          <div className={classes.name}>{userCredentials.name}</div>
          {userCredentials.bio ? (
            <div className={classes.bio}>{bio}</div>
          ) : (
            <div className={classes.bio}>Hello, I'm user</div>
          )}
          {userCredentials.address && (
            <div className={classes.location}>
              <Location /> {address}
            </div>
          )}

          {userCredentials.website && (
            <div className={classes.website}>
              <WebsiteLink />
              <a
                href={`${userCredentials.website}`}
                target="_blank"
                style={{ margin: "0" }}
                rel="noreferrer"
              >
                {userCredentials.website}
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
