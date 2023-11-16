const auth = require('basic-auth');
const bcrypt = require('bcryptjs');
const { User } = require('./models/user'); // Import your User model here

const authenticateUser = async (req, res, next) => {
  // Parse the user's credentials from the Authorization header
  const credentials = auth(req);

  if (credentials) {
    const { name, pass } = credentials;

    // Find the user by their email address
    const user = await User.findOne({ where: { emailAddress: name } });

    // Check if the user exists and if the password matches
    if (user && bcrypt.compareSync(pass, user.password)) {
      // If authentication is successful, add the user to the request object
      req.currentUser = user;
      next(); // Continue processing the request
    } else {
      // If authentication fails, return a 401 Unauthorized status
      res.status(401).json({ message: 'Access Denied' });
    }
  } else {
    // If no credentials are provided, return a 401 Unauthorized status
    res.status(401).json({ message: 'Access Denied' });
  }
};

module.exports = authenticateUser;
