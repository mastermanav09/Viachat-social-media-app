const router = require("express").Router();
const userControllers = require("../controllers/user");
const isAuth = require("../middleware/is-auth");

router.put("/uploadProfilePhoto", isAuth, userControllers.updateProfilePhoto);

module.exports = router;
