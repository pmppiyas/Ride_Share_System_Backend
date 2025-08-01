import { IAuths, IUser } from "./user.interfaces";
import { User } from "./user.model";
import { hashingPassword } from "../../utils/hashingPassword";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { AppError } from "../../Error/appError";
import httpStatus from "http-status-codes";
const createUser = async (payload: IUser) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { auths, email, password, ...rest } = payload;

  let hashPassword = "";
  if (password) {
    hashPassword = await hashingPassword(password);
  }

  const authProvider: IAuths = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashPassword,
    auths: [authProvider],
    ...rest,
  });

  const UserObj = user.toObject();
  delete UserObj.password;
  return UserObj;
};

const getAllUser = async (query: Record<string, string> = {}) => {
  const UserSearchableFields = ["name", "phone", "email"];

  const queryBuilder = new QueryBuilder(User.find(), query)
    .filter()
    .search(UserSearchableFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    queryBuilder.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    users: data,
    meta,
  };
};

const updateUser = async (id: string, payload: Partial<IUser>) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.ACCEPTED, "User not found.");
  }
  const updatedUser = User.findByIdAndUpdate(id, payload, {
    runValidators: true,
    new: true,
  });

  return updatedUser;
};

const deleteUser = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.ACCEPTED, "User not found to delete.");
  }
  const deleteUser = await User.findByIdAndDelete(id);
  return deleteUser;
};

export const UserServices = {
  createUser,
  getAllUser,
  updateUser,
  deleteUser,
};
