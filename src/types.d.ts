type Status = 'pending' | 'active' | 'completed';

interface SignInInput {
  email: string;
  password: string;
}

interface SignUpInput extends SignInInput {
  fullName: string;
}

interface AuthOutput {
  accessToken: string;
}

interface UpdateStudentInput {
  email: string;
  fullName: string;
}

interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
}
