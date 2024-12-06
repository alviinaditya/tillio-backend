import bcrypt from "bcryptjs";

export const hashValue = async (value: string, saltRounds?: number) =>
  bcrypt.hash(value, saltRounds || 10);

export const compareValue = async (value: string, hash: string) =>
  bcrypt.compare(value, hash);
