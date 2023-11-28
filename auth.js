const bcrypt = require('bcryptjs');
const User = require('./models/user');
const auth = require('basic-auth'); // Require basic-auth

const authenticateUser = async (req, res, next) => {
  const credentials = auth(req); // Using basic-auth to parse the credentials

  if (credentials) {
    try {
      const user = await User.findOne({ where: { emailAddress: credentials.name } });

      if (user && bcrypt.compareSync(credentials.pass, user.password)) {
        req.currentUser = user;
        next(); // Continue processing the request
      } else {
        res.status(401).json({ message: 'Access Denied: Invalid Credentials' });
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(401).json({ message: 'Access Denied: Credentials Not Provided' });
  }
};

module.exports = authenticateUser;
