const schedule = require("node-schedule");
const Message = require("../../models/message");

module.exports = function messageDeletionJob() {
  schedule.scheduleJob("0 0 * * *", async () => {
    var date = new Date();
    var daysToDeletion = 180;
    var deletionDate = new Date(date.setDate(date.getDate() - daysToDeletion));

    try {
      await Message.deleteMany({ createdAt: { $lt: deletionDate } });
      console.log("Job executed successfully.");
    } catch (error) {
      console.log("Job execution failed!", error);
    }
  });
};
