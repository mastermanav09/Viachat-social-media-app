const schedule = require("node-schedule");
const Notification = require("../../models/notification");

module.exports = function notificationDeletionJob() {
  schedule.scheduleJob("0 0 * * *", async () => {
    var date = new Date();
    var daysToDeletion = 14;
    var deletionDate = new Date(date.setDate(date.getDate() - daysToDeletion));

    try {
      await Notification.deleteMany({ createdAt: { $lt: deletionDate } });
      console.log("Notification Deletion Job executed successfully.");
    } catch (error) {
      console.log("Job execution failed!", error);
    }
  });
};
