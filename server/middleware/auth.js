const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.header('Authorization').split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decodedToken);
    req.user = { id: decodedToken.id, isAdmin: decodedToken.isAdmin };
    console.log('Request user after auth middleware:', req.user);
    next();
  } catch (error) {
    res.status(401).json({ message: 'No token, authorization denied' });
  }
};
