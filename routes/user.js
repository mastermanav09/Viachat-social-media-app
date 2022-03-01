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
router.get("/getNotifications", isAuth, userControllers.getNotifications);
router.get(
  "/markNotificationsRead",
  isAuth,
  userControllers.markNotificationsRead
);

module.exports = router;
