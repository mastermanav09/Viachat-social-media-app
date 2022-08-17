const router = require("express").Router();
const conversationControllers = require("../controllers/conversation");
const isAuth = require("../middleware/is-auth");

router.get("/", isAuth, conversationControllers.getConversations);

module.exports = router;
