import React, { useEffect } from "react";
import classes from "./Home.module.scss";
import ScreamsList from "../components/scream/ScreamsList";
import Hero from "../components/profile/Hero";
import { NavLink, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/reducers/ui";
import Add from "../components/svg/Add";
import { getScreams } from "../store/reducers/data";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { debounce, throttle } from "../utils/debounceFn";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const Home = (props) => {
  const { handleScreamsLoading, screamsLoader } = props;
  const dispatch = useDispatch();
  const totalResults = useSelector((state) => state.data.totalScreamsCount);
  const screams = useSelector((state) => state.data.screams || []);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const pageLimit = useSelector((state) => state.data.pageLimitScreams);
  const [page, setPage] = useState(1);
  const [errors, setErrors] = useState(null);
  const throttledHandleScreams = debounce(handleScreamsLoading, 200);

  // console.log(totalResults);
  // function handleScreams() {
  //   if (
  //     Math.abs(
  //       window.innerHeight +
  //         document.documentElement.scrollTop -
  //         document.documentElement.scrollHeight
  //     ) <= 50
  //   ) {
  //     setPage((page) => page + 1);
  //     // setHasMoreItems(false);
  //     // return;
  //   }

  //   // dispatch(getScreams({ page }));
  //   // console.log("Fetching more items");
  //   // setPage((page) => page + 1);
  // }

  // useEffect(() => {
  //   if (screams.length >= totalResults) {
  //     return;
  //   }

  //   dispatch(getScreams({ page }));
  // }, [dispatch, page, screams.length, totalResults]);

  useEffect(() => {
    localStorage.setItem("target", "/");
    window.addEventListener("scroll", throttledHandleScreams);

    return () => window.removeEventListener("scroll", throttledHandleScreams);
  }, []);

  return (
    <>
      <Outlet />
      <div className={`${classes.container} `}>
        <div className={`${classes["left-sub-container"]}`}>
          <ScreamsList socket={props.socket} />
          {screamsLoader && (
            <div className={classes.spinner}>
              <LoadingSpinner />
            </div>
          )}
          {/* <InfiniteScroll
            dataLength={screams.length}
            hasMore={hasMoreItems}
            next={fetchMoreItems}
            loader={<h2>Loading </h2>}
          >
          </InfiniteScroll> */}
          {errors && (
            <h2 style={{ textAlign: "center", color: "red", margin: "auto" }}>
              {errors}
            </h2>
          )}
        </div>
        <div className={`${classes["right-sub-container"]}`}>
          <Hero />
        </div>
      </div>

      <NavLink
        to="/add-scream"
        onClick={() => dispatch(uiActions.showPostScreamModal())}
        className={classes["add-scream-mobile"]}
      >
        <li>
          <Add />
        </li>
      </NavLink>
    </>
  );
};

export default Home;
