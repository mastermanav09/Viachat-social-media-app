import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/reducers/ui";
import { updateProfilePhoto } from "../store/reducers/user";
import classes from "./UpdateProfilePicture.module.scss";

const UpdateProfilePicture = (props) => {
  const userState = useSelector((state) => state.user);
  const uiState = useSelector((state) => state.ui);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(userState.credentials.imageUrl);
  const [isNewImageSelected, setIsNewImageSelected] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiActions.errorsNullify());
  }, []);

  const addProfilePhotoHandler = async (e) => {
    e.preventDefault();

    dispatch(uiActions.errorsNullify());
    setIsLoading(true);

    const formData = new FormData();
    formData.append("image", image);
    if (userState.credentials.imageUrl) {
      formData.append("oldPath", userState.credentials.imageUrl);
    }

    formData.append("currentUserId", props.currentUserId);
    dispatch(updateProfilePhoto({ formData, setIsLoading }));
  };

  const imageHandler = (e) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
      setIsNewImageSelected(true);
      dispatch(uiActions.errorsNullify());
    }
  };

  return (
    <div className={classes["wrapper"]}>
      <form onSubmit={addProfilePhotoHandler} noValidate>
        <div
          className={[
            !image ? classes["image-showcase-box"] : classes["remove-showcase"],
          ].join(" ")}
        >
          {image && !isNewImageSelected ? (
            <img
              src={image}
              alt="preview"
              className={classes["image-showcase"]}
            />
          ) : (
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              className={classes["image-showcase"]}
            />
          )}
        </div>
        <div className={classes["image-edit-main"]}>
          <label
            className={[
              classes["image-input-box"],
              isNewImageSelected
                ? classes["selected"]
                : classes["not-selected"],
            ].join(" ")}
          >
            <i className="fas fa-cloud-upload-alt fa-3x"></i>
            <input
              type="file"
              className={classes["hidden"]}
              onChange={imageHandler}
            />
            <span className="mt-2 text-sm font-medium">
              {isNewImageSelected ? (
                <span>Image Selected</span>
              ) : (
                <span>Select Image</span>
              )}
            </span>
          </label>
        </div>
        <div className={classes["footer"]}>
          <div className={classes["sub-footer-part"]}>
            {uiState.errors && (
              <p className={classes.validate}>{uiState.errors}</p>
            )}

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
    </div>
  );
};

export default UpdateProfilePicture;
