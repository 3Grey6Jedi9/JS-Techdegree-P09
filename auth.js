const bcrypt = require('bcryptjs');
const User = require('./models/user'); // Adjust the path as needed

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Basic ')) {
    // Extract the credentials part and split it by ':'
    const base64Credentials = authHeader.slice(6);
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');

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
