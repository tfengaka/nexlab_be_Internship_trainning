type Status = 'pending' | 'active' | 'completed' | 'deleted';
type NodeEnv = 'development' | 'production' | 'staging';

interface FormSignInInput {
  email: string;
  password: string;
}

interface FormSignUpInput extends FormSignInInput {
  full_name: string;
}

interface FormRefreshTokenInput {
  refresh_token: string;
}

interface AuthToken {
  access_token: string;
  refresh_token: string;
}

interface FormOTPVerifyInput {
  email: string;
  otp: string;
}

interface FormUpdateStudent {
  full_name: string;
  email: string;
}

interface FormEditPasswordInput {
  oldPassword: string;
  newPassword: string;
}
