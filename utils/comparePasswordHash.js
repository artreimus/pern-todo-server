import bcrypt from 'bcrypt';

const comparePasswordHash = async (candidatePassword, hashPassword) => {
  const isMatch = await bcrypt.compare(candidatePassword, hashPassword);
  return isMatch;
};

export default comparePasswordHash;
