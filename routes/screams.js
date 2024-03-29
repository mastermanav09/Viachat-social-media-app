const router = require("express").Router();
const screamsController = require("../controllers/screams");
const bodyValidationArray = require("../utils/validators/others/bodyValidation");
const isAuth = require("../middleware/is-auth");

router.get("/screams/:page", isAuth, screamsController.getAllScreams);
router.get("/screams", isAuth, screamsController.getScreamsCount);
router.post(
  "/create",
  isAuth,
  bodyValidationArray,
  screamsController.createScream
);
router.get("/:screamId", isAuth, screamsController.getScream);
router.delete("/:screamId/delete", isAuth, screamsController.deleteScream);

router.post(
  "/:screamId/addComment",
  isAuth,
  bodyValidationArray,
  screamsController.addComment
);
router.delete(
  "/:userHandle/:screamId/:commentId/deleteComment",
  isAuth,
  screamsController.deleteComment
);

router.get("/:screamId/like", isAuth, screamsController.likeScream);
router.get("/:screamId/unlike", isAuth, screamsController.unlikeScream);

module.exports = router;
