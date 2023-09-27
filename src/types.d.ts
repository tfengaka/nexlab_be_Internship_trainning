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

interface ActionPayload<T> {
  action: {
    name: string;
  };
  input: T;
  request_query: string;
  session_variables: Record<string, string>;
}
