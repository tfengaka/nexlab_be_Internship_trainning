interface StudentModel {
  id?: string;
  fullName: string;
  email: string;
  password: string;
}

interface StudentData extends StudentModel {
  createdAt?: string;
  updatedAt?: string;
}

interface ClassModel {
  id?: string;
  className: string;
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
