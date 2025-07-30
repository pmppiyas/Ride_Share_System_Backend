import { IRider } from "./rider.interfaces";
import { Rider } from "./rider.model";
import { hashingPassword } from "./../../utils/hashingPassword";
import { QueryBuilder } from "../../utils/QueryBuilder";

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

export const getAllRider = async (query: Record<string, string> = {}) => {
  const riderSearchableFields = ["name", "phone", "email"];

  const queryBuilder = new QueryBuilder(Rider.find(), query)
    .filter()
    .search(riderSearchableFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    queryBuilder.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    tours: data,
    meta,
  };
};

export const RiderServices = {
  createRider,
  getAllRider,
};
