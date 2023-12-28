const jwt = require('jsonwebtoken');

const admin = (req, res, next) => {
  // Assuming the auth middleware has already run and set req.user
  if (req.user && req.user.isAdmin) {
    next(); // User is an admin, so continue to the next middleware
  } else {
    res.status(403).json({ message: 'Access denied' }); // User is not an admin
  }
};

module.exports = admin;
