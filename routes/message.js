const router = require("express").Router();
const messageControllers = require("../controllers/message");
const isAuth = require("../middleware/is-auth");

router.post("/addMessage", isAuth, messageControllers.addMessage);
router.get("/:conversationId/:page", isAuth, messageControllers.getMessages);

module.exports = router;
