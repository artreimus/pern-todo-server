const createTokenUser = (user) => {
  return { user_id: user.user_id, email: user.email };
};

export default createTokenUser;
