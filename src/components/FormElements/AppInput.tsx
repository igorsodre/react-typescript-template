import React from 'react';

interface AppInputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  haserror: boolean;
  errortext?: string;
  label?: string;
  register:
    | string
    | ((instance: HTMLInputElement | null) => void)
    | React.RefObject<HTMLInputElement>
    | null
    | undefined;
}
const AppInput: React.FC<AppInputProps> = ({ label, haserror, errortext, register, ...defaultInputProps }) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input {...defaultInputProps} ref={register} />
      {haserror && <p style={{ color: '#ee5253' }}>{errortext}</p>}
    </div>
  );
};

export default AppInput;
