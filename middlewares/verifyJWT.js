import jwt from 'jsonwebtoken';

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'Invalid Auth token', isError: true });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({ message: 'Invalid token', isError: true });

    req.user_id = decoded.user.user_id;
    req.email = decoded.user.email;
    next();
  });
};

export default verifyJWT;
