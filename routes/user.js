const router = require("express").Router();
const userControllers = require("../controllers/user");
const isAuth = require("../middleware/is-auth");
const profileValidationArray = require("../utils/validators/profle/profleValidation");

router.put("/updateProfilePhoto", isAuth, userControllers.updateProfilePhoto);
router.put(
  "/updateProfile",
  isAuth,
  profileValidationArray,
  userControllers.updateProfile
);

module.exports = router;
