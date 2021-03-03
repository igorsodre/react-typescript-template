import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { RouteComponentProps } from 'react-router-dom';
import AppInput from '../../components/FormElements/AppInput';
import MainContainer from '../../components/UiContainers/MainContainer';
import { AppContext, IAppContext } from '../../data/app-context';
import { useAuth } from '../../hooks/auth-service';

interface FormInputs {
  name: string;
  email: string;
  password: string;
  newpassword: string;
}

const Profile: React.FC<RouteComponentProps> = (props) => {
  const ctx = useContext(AppContext) as IAppContext;
  const { register, handleSubmit, formState, errors, reset } = useForm<FormInputs>({
    defaultValues: { email: ctx.currentUser?.email, name: ctx.currentUser?.name, password: '', newpassword: '' },
    mode: 'onChange',
  });
  const { isValid } = formState;

  const { updateUser } = useAuth();

  const submithandler = async (data: FormInputs) => {
    console.log('clicked update');
    const { name, email, password, newpassword } = data;
    try {
      const result = await updateUser(name, email, password, newpassword);
      reset();
      ctx.setCurrentUser(result);
      props.history.replace('/home');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <MainContainer>
      <form onSubmit={handleSubmit(submithandler)}>
        <h3>Update Profile</h3>

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

        <AppInput
          label="New Password"
          register={register({ minLength: 4 })}
          name="newpassword"
          type="password"
          className="form-control"
          placeholder="Enter new password"
          haserror={!!errors.newpassword}
          errortext="Minimum length for password: 4"
        />

        <button disabled={!isValid} type="submit" className="btn btn-dark btn-lg btn-block">
          Update
        </button>
      </form>
    </MainContainer>
  );
};

export default Profile;
