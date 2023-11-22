const bcrypt = require('bcryptjs');
const User = require('./models/user');




/* This is an asynchronous function that takes three parameters: req, res and next. The req parameter is an object
that contains information about the incoming request, the res parameter is an object that is used to send responses to the
client and the next parameter is a function that is called to continue processing the request */
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization; // Retrieving the authorization header from the req object.

  if (authHeader && authHeader.startsWith('Basic ')) {
    // Extracting the credentials part
    const credentialsPart = authHeader.slice(6);
    // Splitting by ':' to separate email and password
    const [email, password] = credentialsPart.split(':');

    try {
      const user = await User.findOne({ where: { emailAddress: email } });

      if (user && bcrypt.compareSync(password, user.password)) {
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