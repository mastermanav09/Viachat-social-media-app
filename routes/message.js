const router = require("express").Router();
const messageControllers = require("../controllers/message");

router.post("/addMessage", messageControllers.addMessage);
router.get("/:conversationId", messageControllers.getMessages);

module.exports = router;
