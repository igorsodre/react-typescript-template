import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, RouteComponentProps } from 'react-router-dom';
import AppInput from '../../components/FormElements/AppInput';
import { useAuth } from '../../hooks/auth-service';
import './Login.scss';

interface FormInputs {
  email: string;
  password: string;
}
interface LoginPageProps extends RouteComponentProps {}
const LoginPage: React.FC<LoginPageProps> = (props) => {
  const { register, handleSubmit, formState, errors, reset } = useForm<FormInputs>({
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  });
  const { isValid } = formState;

  const { login } = useAuth();

  const submithandler = async (data: FormInputs) => {
    const { email, password } = data;
    try {
      const result = await login(email, password);
      reset();
      console.log(result);
      props.history.replace('/');
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <form onSubmit={handleSubmit(submithandler)}>
      <h3>Log in</h3>

      <AppInput
        label="Email"
        register={register({
          required: true,
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'invalid email address',
          },
        })}
        name="email"
        type="email"
        className="form-control"
        placeholder="Enter email"
        haserror={!!errors.email}
        errortext={errors.email?.message || ''}
      />

      <AppInput
        label="Password"
        register={register({ minLength: 4 })}
        name="password"
        type="password"
        className="form-control"
        placeholder="Enter password"
        haserror={!!errors.password}
        errortext="Minimum length for password: 4"
      />

      <div className="form-group">
        <div className="custom-control custom-checkbox">
          <input type="checkbox" className="custom-control-input" id="customCheck1" />
          <label className="custom-control-label" htmlFor="customCheck1">
            Remember me
          </label>
        </div>
      </div>

      <button disabled={!isValid} type="submit" className="btn btn-dark btn-lg btn-block">
        Sign in
      </button>
      <p className="forgot-password text-right">
        Forgot <Link to="/">password?</Link>
      </p>
    </form>
  );
};

export default LoginPage;
