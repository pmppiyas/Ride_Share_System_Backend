import { IRider } from "./rider.interfaces";
import { Rider } from "./rider.model";
import { hashingPassword } from "./../../utils/hashingPassword";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { AppError } from "../../Error/appError";
import httpStatus from "http-status-codes";
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

const getAllRider = async (query: Record<string, string> = {}) => {
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

const updateRider = async (id: string, payload: Partial<IRider>) => {
  const rider = await Rider.findById(id);
  if (!rider) {
    throw new AppError(httpStatus.ACCEPTED, "Rider not found.");
  }
  const updatedRider = Rider.findByIdAndUpdate(id, payload, {
    runValidators: true,
    new: true,
  });

  return updatedRider;
};

const deleteRider = async (id: string) => {
  const rider = await Rider.findById(id);
  if (!rider) {
    throw new AppError(httpStatus.ACCEPTED, "Rider not found to delete.");
  }
  const deleteRider = await Rider.findByIdAndDelete(id);
  return deleteRider;
};

export const RiderServices = {
  createRider,
  getAllRider,
  updateRider,
  deleteRider,
};
