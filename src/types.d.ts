interface StudentModel {
  id?: string;
  fullName: string;
  email: string;
  password: string;
  status?: string;
}

interface ClassModel {
  id?: string;
  className: string;
  status?: string;
}

interface SignInInput {
  email: string;
  password: string;
}

interface SignUpInput extends SignInInput {
  fullName: string;
}

interface AuthOutput {
  student: StudentData;
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
