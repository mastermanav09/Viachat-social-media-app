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

router.get("/getNotifications", isAuth, userControllers.getNotifications);
router.get("/showNotifications", isAuth, userControllers.showNotifications);

module.exports = router;
