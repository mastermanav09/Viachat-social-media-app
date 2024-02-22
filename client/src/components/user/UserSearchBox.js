import React, { useEffect, useRef, useState } from "react";
import classes from "./UserSearchBox.module.scss";
import { useSelector } from "react-redux";
import SearchedUsersList from "./SearchedUsersList";
import { throttle } from "../../utils/debounceFn";
import axios from "axios";
import Cookies from "js-cookie";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

const UserSearchBox = (props) => {
  const uiState = useSelector((state) => state.ui);

  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [loader, setLoader] = useState(false);
  const [textInput, setTextInput] = useState("");

  const scrollRef = useRef();

  useEffect(() => {
    function getMoreResults() {
      if (searchResults?.length >= totalResults) {
        setLoader(false);
        return;
      }
    }

    getMoreResults();
  }, [page]);

  function handleSearchResultsLoading(event) {
    let diff = Math.abs(
      event.target.scrollHeight -
        (event.target.clientHeight + event.target.scrollTop)
    );

    if (diff <= 50) {
      if (searchResults?.length >= totalResults) {
        setLoader(false);
        return;
      }

      setLoader(true);
      setPage((page) => page + 1);
    }
  }

  useEffect(() => {
    fetchResults(page, textInput);
  }, [page]);

  const fetchResults = async (page, textInput) => {
    const text = textInput;
    const token = Cookies.get("upid");

    if (!text || text.trim().length === 0) {
      setNoResultsFound(false);
      setSearchResults([]);
      setLoader(false);
      return;
    }

    try {
      setError(null);
      setNoResultsFound(false);
      setLoader(true);

      const res = await axios({
        method: "PUT",
        url: `/api/user/search`,
        data: {
          text,
          page,
        },
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (res.status !== 200) {
        const error = new Error("Can't load more result!");
        throw error;
      }

      if (page === 1) {
        setSearchResults(res.data.results);
      } else {
        setSearchResults((prev) => [...prev, ...res.data.results]);
      }

      setTotalResults(res.data.totalResults);
      if (res.data.results.length === 0) {
        setNoResultsFound(true);
      }

      setLoader(false);
    } catch (error) {
      console.log(error);
      setError("Something went wrong!");
    }
  };

  const handleInputChange = (event) => {
    setTextInput(event.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResults(1, textInput);
      setPage(1);
      scrollRef?.current.scrollIntoView({
        behavior: "instant",
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [textInput]);

  return (
    <div
      className={[
        classes.searchBox,
        uiState.showUserSearchBox ? classes["open"] : classes["close"],
      ].join(" ")}
    >
      <div className={classes.inputBox}>
        <input
          type="text"
          placeholder="Let's find someone..."
          onChange={handleInputChange}
        />
      </div>

      {searchResults !== null && (
        <SearchedUsersList
          handleSearchResultsLoading={throttle(handleSearchResultsLoading, 200)}
          scrollRef={scrollRef}
          searchResults={searchResults}
          error={error}
          loader={loader}
          noResultsFound={noResultsFound}
        />
      )}
    </div>
  );
};

export default UserSearchBox;
