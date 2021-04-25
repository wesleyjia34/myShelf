const { User } = require('../models/mainModels');

const userController = {};

// middleware to create a new user
userController.createUser = async (req, res, next) => {
  const { userName, password, email, firstName, lastName } = req.body;
  if (!userName || !password || !email || !firstName || !lastName ) return next('Missing information in userController.createUser');

  // NOTE: Do we need some kind of a check here to see if a user with this userName already exists???

  try {
    const newUser = await User.create({ userName, password, email, firstName, lastName });
    res.locals.user = newUser;
    return next();
  } catch (error) {
    console.log(error.stack);
    return next(error);
  }
};

// POSSIBLY:
// userController.encryptPassword = (req, res, next) => {
//   
// };

// middleware to check whether user already exists
userController.verifyUser = async (req, res, next) => {
  const { userName, password } = req.body;

  // only query userName; check out bcrypt docs to see how to compare input password and encrypted password
  try {
    const foundUser = await User.findOne({ userName }).exec();
    if (foundUser !== null) {
      bcrypt.compare(password, foundUser.password, (err, res) => {
        if (err) return next(err);
        if (res) {
          console.log(`User ${userName} verified!`);
          return next();
        }
      });
    } else {
      res.locals.notFound = true;
      return next();
    }
  } catch (error) {
    console.log(error.stack);
    return next(error);
  }
}

module.exports = userController;