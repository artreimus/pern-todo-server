import CustomError from '../error/index.js';

const checkCookies = (req) => {
  const cookies = req.signedCookies;

  if (!cookies?.refreshToken) {
    throw new CustomError.BadRequestError('Invalid authentication');
  }

  return cookies;
};

export default checkCookies;
