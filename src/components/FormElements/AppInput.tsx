import React from 'react';

interface AppInputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  haserror: boolean;
  errortext?: string;
  label?: string;
  register: any;
}
const AppInput: React.FC<AppInputProps> = (props) => {
  const inputProps: Partial<AppInputProps> = { ...props };
  delete inputProps.haserror;
  delete inputProps.register;
  delete inputProps.errortext;
  delete inputProps.label;
  return (
    <div className="form-group">
      <label>{props.label}</label>
      <input {...inputProps} ref={props.register} />
      {props.haserror && <p style={{ color: '#ee5253' }}>{props.errortext}</p>}
    </div>
  );
};

export default AppInput;
