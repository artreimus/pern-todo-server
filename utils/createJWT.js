import jwt from 'jsonwebtoken';

const createJWT = (payload, key, expiration) => {
  const token = jwt.sign(payload, key, { expiresIn: expiration });
  return token;
};

export default createJWT;
