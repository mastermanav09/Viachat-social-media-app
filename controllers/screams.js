const Scream = require("../models/scream");

exports.getAllScreams = async (req, res, next) => {
  try {
    const screams = await Scream.find()
      .select(["-__v", "-updatedAt"])
      .sort({ createdAt: -1 });

    res.status(200).json({
      screams: screams,
    });
  } catch (error) {
    console.log(error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.createScream = async (req, res, next) => {
  const user = req.body.userHandle;
  const body = req.body.body;

  try {
    const scream = new Scream({
      userHandle: user,
      body: body,
      likeCount: 0,
      commentCount: 0,
    });

    await scream.save();

    res.status(201).json({
      message: "Scream created successfully!",
    });
  } catch (error) {
    console.log(error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};
