/* eslint-disable @typescript-eslint/no-this-alias */
import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { TUser, UserModel } from './user.interface';
import config from '../../app/config';

const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (value: string) {
          return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value);
        },
        message: '{VALUE} is not a valid email',
      },
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    role: {
      type: String,
      enum: {
        values: ['customer', 'admin'],
        message: '{VALUE} is not valid, please provide a valid role',
      },
      default: 'customer',
      required: true,
    },
    isActivate: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  const user = this;

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

userSchema.statics.isUserExistsById = async function (_id: string) {
  return await User.findOne({ _id }).select('+password');
};

export const User = model<TUser, UserModel>('User', userSchema);
