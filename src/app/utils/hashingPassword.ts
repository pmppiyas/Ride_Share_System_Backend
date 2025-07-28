import bcryptjs from "bcryptjs";
import { envVars } from "./../../config/env";

export const hashingPassword = async (password: string): Promise<string> => {
  const saltRound = Number(envVars.BCRYPT_SALT_ROUND);

  return await bcryptjs.hash(password, saltRound);
};
