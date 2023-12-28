const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.header('Authorization').split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decodedToken.id };
    next();
  } catch (error) {
    res.status(401).json({ message: 'No token, authorization denied' });
  }
};
