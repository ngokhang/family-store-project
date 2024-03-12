import { compareSync, hashSync } from 'bcrypt';

export const hashPassword = (text: string) => {
  return hashSync(text, 10);
};

export const comparePassword = (text: string, hash: string) => {
  return compareSync(text, hash);
};
