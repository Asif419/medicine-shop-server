/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TUser } from '../users/user.interface';
import { User } from '../users/user.model';
import { TLoginUser } from './auth.interface';

import AppError from '../../app/errors/AppError';
import config from '../../app/config';

const register = async (payload: TUser) => {
  const result = await User.create(payload);
  return result;
  // return await User.findById(result._id).select('+password');
};

const login = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload.email }).select('+password');

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
  }

  if (!user.isActivate) {
    throw new AppError(StatusCodes.FORBIDDEN, 'This user is deactivated!');
  }

  const isPasswordMatch = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordMatch) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid credentials!');
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const { password, ...remainingData } = user.toObject();

  return { accessToken, refreshToken, user: remainingData };
};

const refreshToken = async (token: string) => {
  try {
    const decoded = jwt.verify(
      token,
      config.jwt_refresh_secret as string,
    ) as JwtPayload;
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
    }

    if (!user.isActivate) {
      throw new AppError(StatusCodes.FORBIDDEN, 'This user is deactivated!');
    }

    const accessToken = generateAccessToken(user);
    return { accessToken };
  } catch (error) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'Invalid or expired refresh token',
    );
  }
};

const generateAccessToken = (user: TUser) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    config.jwt_access_secret as string,
    { expiresIn: '15d' },
  );
};

const generateRefreshToken = (user: TUser) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    config.jwt_refresh_secret as string,
    { expiresIn: '365d' },
  );
};

export const AuthServices = {
  login,
  register,
  refreshToken,
};
