const router = require("express").Router();
const screamsController = require("../controllers/screams");

router.get("/getScreams", screamsController.getAllScreams);
router.post("/createScream", screamsController.createScream);

module.exports = router;
