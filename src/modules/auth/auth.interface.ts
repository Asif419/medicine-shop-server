export type TLoginUser = {
  email: string;
  password: string;
};

export type TUpdatePassword = {
  email: string;
  oldPassword: string;
  newPassword: string;
};
