const router = require("express").Router();
const conversationControllers = require("../controllers/conversation");
const isAuth = require("../middleware/is-auth");

router.get("/", isAuth, conversationControllers.getConversations);
router.post("/add", isAuth, conversationControllers.addNewConversation);

module.exports = router;
