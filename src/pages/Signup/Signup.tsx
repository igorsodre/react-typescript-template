import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, RouteComponentProps } from 'react-router-dom';
import AppInput from '../../components/FormElements/AppInput';
import MainContainer from '../../components/UiContainers/MainContainer';
import { useAuth } from '../../hooks/auth-service';

interface FormInputs {
  name: string;
  email: string;
  password: string;
}

const Signup: React.FC<RouteComponentProps> = (props) => {
  const { register, handleSubmit, formState, errors, reset } = useForm<FormInputs>({
    defaultValues: { email: '', name: '', password: '' },
    mode: 'onChange',
  });
  const { isValid } = formState;

  const { register: signup } = useAuth();

  const submithandler = async (data: FormInputs) => {
    const { name, email, password } = data;
    try {
      const result = await signup(name, email, password);
      reset();
      console.log(result);
      props.history.replace('/login');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <MainContainer>
      <form onSubmit={handleSubmit(submithandler)}>
        <h3>Register</h3>

        <AppInput
          label="Full Name"
          register={register({
            required: true,
          })}
          name="name"
          type="text"
          className="form-control"
          placeholder="Full Name"
          haserror={!!errors.name}
          errortext="Name is required"
        />

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

        <button disabled={!isValid} type="submit" className="btn btn-dark btn-lg btn-block">
          Register
        </button>
        <p className="forgot-password text-right">
          Already registered <Link to="/login">log in?</Link>
        </p>
      </form>
    </MainContainer>
  );
};

export default Signup;
