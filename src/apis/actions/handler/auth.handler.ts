import { SignIn, SignUp } from '~/service/student.service';
import { IHandler } from '~/apis/actions/handler';

export const sign_in: IHandler<{ form: FormSignInInput }> = async ({ params }) => await SignIn(params.form);
export const sign_up: IHandler<{ form: FormSignUpInput }> = async ({ params }) => await SignUp(params.form);
