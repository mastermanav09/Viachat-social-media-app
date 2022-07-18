import React, { useState, useEffect } from "react";
import classes from "./EditProfile.module.scss";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUserDetails } from "../store/reducers/user";
import { uiActions } from "../store/reducers/ui";

const EditProfile = (props) => {
  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const uiState = useSelector((state) => state.ui);
  const [isLoading, setIsLoading] = useState(false);
  const ageInputRef = useRef(userState.credentials.age || null);
  const bioInputRef = useRef(userState.credentials.bio || null);
  const addressInputRef = useRef(userState.credentials.address || null);
  const websiteInputRef = useRef(userState.credentials.website || null);

  useEffect(() => {
    dispatch(uiActions.errorsNullify());
  }, []);

  const addDetailsHandler = async (e) => {
    e.preventDefault();

    dispatch(uiActions.errorsNullify());
    setIsLoading(true);

    const age = ageInputRef.current.value;
    const bio = bioInputRef.current.value;
    const address = addressInputRef.current.value;
    const website = websiteInputRef.current.value;

    await dispatch(
      addUserDetails({
        age,
        bio,
        address,
        website,
        userId: props.currentUserId,
        setIsLoading,
      })
    );
  };

  let errors = null;
  if (uiState.errors) {
    errors = uiState.errors.message || uiState.errors.errorData[0].msg;
  }

  return (
    <div>
      <main className={classes.wrapper}>
        <section className={classes["section-form"]}>
          <h2 className={classes.title}>Edit your profile</h2>

          <form
            className={classes.form}
            noValidate
            onSubmit={addDetailsHandler}
          >
            <div className={classes["form-group"]}>
              <label htmlFor="name" className={`${classes["form-label"]} `}>
                Age:
              </label>
              <div className={classes["form-addon"]} data-states-for="name">
                <input
                  type="number"
                  id="age"
                  name="age"
                  className={classes["form-input"]}
                  placeholder="Ex: 18"
                  defaultValue={userState.credentials.age}
                  ref={ageInputRef}
                />
              </div>
            </div>

            <div className={classes["form-group"]}>
              <label htmlFor="bio" className={`${classes["form-label"]}`}>
                Bio
              </label>

              <div className={classes["form-addon"]} data-states-for="bio">
                <input
                  type="text"
                  id="bio"
                  name="bio"
                  className={classes["form-input"]}
                  placeholder="Ex: I am an engineer..."
                  defaultValue={userState.credentials.bio}
                  ref={bioInputRef}
                />
              </div>
            </div>

            <div className={classes["form-group"]}>
              <label htmlFor="address" className={classes["form-label"]}>
                Address
              </label>

              <div className={classes["form-addon"]} data-states-for="address">
                <input
                  type="text"
                  id="address"
                  name="address"
                  className={classes["form-input"]}
                  placeholder="Ex: 10233 Gaillard Lake Est Texas "
                  defaultValue={userState.credentials.address}
                  ref={addressInputRef}
                />

                <span
                  className={`${classes["form-addon__icon"]} ${classes["icon-valid"]}`}
                ></span>
                <span
                  className={`${classes["form-addon__icon"]} ${classes["icon-invalid"]}`}
                ></span>
              </div>
            </div>

            <div className={classes["form-group"]}>
              <label htmlFor="website" className={`${classes["form-label"]}`}>
                Website
              </label>

              <div className={classes["form-addon"]} data-states-for="website">
                <input
                  type="website"
                  id="website"
                  name="website"
                  className={classes["form-input"]}
                  placeholder="Ex: some_site.com"
                  defaultValue={userState.credentials.website}
                  ref={websiteInputRef}
                />

                <span
                  className={`${classes["form-addon__icon"]} ${classes["icon-valid"]}`}
                ></span>
                <span
                  className={`${classes["form-addon__icon"]} ${classes["icon-invalid"]}`}
                ></span>
              </div>
            </div>

            <div className={classes["form-footer"]}>
              <div className={classes["sub-footer-part"]}>
                {errors && <p className={classes.validate}>{errors}</p>}
                <button type="submit" className={classes["save-btn"]}>
                  {isLoading ? (
                    <div className={`${classes["dual-ring"]}`}></div>
                  ) : (
                    <> Save</>
                  )}
                </button>
              </div>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default EditProfile;
