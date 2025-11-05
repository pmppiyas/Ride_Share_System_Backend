import httpStatus from "http-status-codes";
import { AppError } from "../../Error/appError";
import { hashingPassword } from "../../utils/hashingPassword";
import { randomLocationWithinRadius } from "../../utils/locationGenerate";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { IAuths, IUser, Role } from "./user.interfaces";
import { User } from "./user.model";

// 📍 Dhaka center [lng, lat]
const DHAKA_CENTER: [number, number] = [90.4125, 23.8103];

export const createUser = async (payload: IUser) => {
  const { auths, email, password, role, location, ...rest } = payload;
  let hashPassword = "";
  if (password) {
    hashPassword = await hashingPassword(password);
  }

  const authProvider: IAuths = {
    provider: "credentials",
    providerId: email as string,
  };

  let userLocation = location;

  const randomCoords = randomLocationWithinRadius(DHAKA_CENTER, 10);
  userLocation = {
    type: "Point",
    coordinates: randomCoords,
    updatedAt: new Date(),
  };

  const user = await User.create({
    email,
    password: hashPassword,
    role: role || Role.RIDER,
    auths: [authProvider],
    location: userLocation,
    ...rest,
  });

  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
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

const getSingleUser = async (id: string) => {
  const user = User.findById(id);
  return user;
};

const updateUser = async (userId: string, payload: Partial<IUser>) => {
  const ifUserExist = await User.findById(userId);

  if (!ifUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};

const deleteUser = async (id: string) => {
  const user = await User.findById(id);
  if (!user || user.isDeleted) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User not found or already deleted."
    );
  }

  user.isDeleted = true;
  await user.save();

  return deleteUser;
};

export const UserServices = {
  createUser,
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
