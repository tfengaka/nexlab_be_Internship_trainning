type Status = 'pending' | 'active' | 'completed';
type NodeEnv = 'development' | 'production' | 'staging';

interface SignInInput {
  email: string;
  password: string;
}

interface SignUpInput extends SignInInput {
  fullName: string;
}

interface AuthOutput {
  access_token: string;
}

interface UpdateStudentInput {
  email: string;
  fullName: string;
}

interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
}
