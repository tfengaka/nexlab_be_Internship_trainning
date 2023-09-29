type Status = 'pending' | 'active' | 'completed';
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

interface FormUpdateStudent {
  full_name: string;
  email: string;
}

interface FormEditPasswordInput {
  oldPassword: string;
  newPassword: string;
}

interface IHasuraAction<Type = Record<string, any>> {
  action: {
    name: string;
  };
  input: Type;
  request_query: string;
  session_variables: Record<string, string>;
}
