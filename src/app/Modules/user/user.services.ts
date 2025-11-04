import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../Error/appError";
import { hashingPassword } from "../../utils/hashingPassword";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { IAuths, IUser, Role } from "./user.interfaces";
import { User } from "./user.model";
const createUser = async (payload: IUser) => {
  console.log(payload);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { auths, email, password, role, ...rest } = payload;

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
    role: Role.RIDER,
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

const getSingleUser = async (id: string) => {
  const user = User.findById(id);
  return user;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const ifUserExist = await User.findById(userId);

  if (!ifUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  // if (payload.password) {
  //   payload.password = await bcryptjs.hash(
  //     payload.password,
  //     envVars.BCRYPT_SALT_ROUND
  //   );
  // }
  console.log(payload);

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
