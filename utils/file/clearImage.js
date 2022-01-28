const fs = require("fs/promises");
const path = require("path");

module.exports = {
  clearImage: async (filePath) => {
    filePath = path.join(__dirname, "../", "../", filePath);
    const result = await fs.unlink(filePath, (err) => console.log(err));
    return result;
  },
};
