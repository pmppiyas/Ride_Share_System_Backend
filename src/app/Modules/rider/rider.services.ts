import { IRider, IAuths } from "./rider.interfaces";
import { Rider } from "./rider.model";
import { hashingPassword } from "./../../utils/hashingPassword";

const createRider = async (payload: IRider) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { auths, phone, email, password, ...rest } = payload;

  // const isEmailExist = await Rider.findOne({ email });
  // if (isEmailExist) {
  //   throw new Error("A user has already registered with this email.");
  // }

  // const isPhoneExist = await Rider.findOne({ phone });
  // if (isPhoneExist) {
  //   throw new Error("A user has already registered with this phone.");
  // }

  let hashPassword = "";
  if (password) {
    hashPassword = await hashingPassword(password);
  }

  const authProvider: IAuths = {
    provider: "credentials",
    providerId: phone as string,
  };

  const rider = await Rider.create({
    email,
    phone,
    password: hashPassword,
    auths: authProvider,
    ...rest,
  });

  const riderObj = rider.toObject();
  delete riderObj.password;
  return riderObj;
};

export const RiderServices = {
  createRider,
};
