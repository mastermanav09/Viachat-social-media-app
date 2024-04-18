import React from "react";
import classes from "./SearchedUsersList.module.scss";
import UserItem from "./UserItem";
import { throttle } from "../../utils/debounceFn";
import LoadingSpinner from "../UI/LoadingSpinner";

const SearchedUsersList = (props) => {
  const {
    searchResults,
    noResultsFound,
    error,
    handleSearchResultsLoading,
    loader,
    scrollRef,
  } = props;

  return (
    <div
      className={classes["userSearch-results"]}
      onScroll={handleSearchResultsLoading}
      ref={scrollRef}
    >
      {searchResults?.map((user) => (
        <UserItem key={user._id} user={user} />
      ))}

      {loader && (
        <div
          style={{
            textAlign: "center",
          }}
        >
          <LoadingSpinner />
        </div>
      )}

      {noResultsFound && searchResults.length === 0 && (
        <p
          style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.8rem" }}
        >
          No results found! ☹️
        </p>
      )}
      {error && (
        <p style={{ textAlign: "center", color: "red", fontSize: "0.8rem" }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default SearchedUsersList;
