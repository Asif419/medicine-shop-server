import { StatusCodes } from 'http-status-codes';
import { TUser } from './user.interface';
import { User } from './user.model';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../app/errors/AppError';

const createUserIntoDB = async (payload: TUser): Promise<TUser> => {
  payload.role = 'admin';
  const result = await User.create(payload);
  return result;
};

const getUserFromDB = async (user : JwtPayload) => {
  const result = await User.findOne({email : user?.email});
  return result;
};

const updateUserActiveStatusIntoDb = async (id: string) => {
  const userId = await User.findById(id);

  if (!userId) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  if (userId?.isActivate == false) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User already deactivate');
  }

  const result = await User.findByIdAndUpdate(
    id,
    { isActivate: false },
    {
      new: true,
      runValidators: true,
    },
  );
  return result;
};

const getAllUsersFromDb = async () => {
  const result = await User.find({role : "user"}).select('-password');
  return result;
}

export const UserService = {
  getUserFromDB,
  createUserIntoDB,
  getAllUsersFromDb ,
  updateUserActiveStatusIntoDb,
};
