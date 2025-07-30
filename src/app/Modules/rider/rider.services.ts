import { IRider } from "./rider.interfaces";
import { Rider } from "./rider.model";
import { hashingPassword } from "./../../utils/hashingPassword";

const createRider = async (payload: IRider) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { auths, phone, email, password, ...rest } = payload;

  let hashPassword = "";
  if (password) {
    hashPassword = await hashingPassword(password);
  }

  const rider = await Rider.create({
    email,
    phone,
    password: hashPassword,
    ...rest,
  });

  const riderObj = rider.toObject();
  delete riderObj.password;
  return riderObj;
};

const getAllRider = async () => {
  const riders = Rider.find({});
  return riders;
};

export const RiderServices = {
  createRider,
  getAllRider,
};
