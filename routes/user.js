const router = require("express").Router();
const userControllers = require("../controllers/user");
const isAuth = require("../middleware/is-auth");
const profileValidationArray = require("../utils/validators/profile/profileValidation");

router.put("/updateProfilePhoto", isAuth, userControllers.updateProfilePhoto);
router.put(
  "/updateProfile",
  isAuth,
  profileValidationArray,
  userControllers.updateProfile
);

router.get("/getUserDetails", isAuth, userControllers.getUserDetails);
router.get("/:userId", isAuth, userControllers.getUserData);
router.put("/search", isAuth, userControllers.getUserSearchResults);
router.get("/getNotifications", isAuth, userControllers.getNotifications);
router.post(
  "/markNotificationRead",
  isAuth,
  userControllers.markNotificationRead
);

module.exports = router;
