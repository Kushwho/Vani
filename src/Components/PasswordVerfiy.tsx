import { FC } from "react";

export interface PasswordVerifyProps {
  onPasswordChange: (value:string) => void;
  password: string;
  onVerifyPasswordChange: (value:string) => void;
  verifyPassword: string;
  errorMessageDisplay:{
    password:string | null,
    verifyPassword:string | null
  }
}

const PasswordVerify: FC<PasswordVerifyProps> = ({
  onPasswordChange,
  password,
  onVerifyPasswordChange,
  verifyPassword,
  errorMessageDisplay

}) => {
  return (
    <>
      {" "}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="********"
          className="w-full px-3 py-2 border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={password}
          onChange={(event) => {
            event.preventDefault()
            onPasswordChange(event.target.value)
          }}
        />
        {errorMessageDisplay.password && (
          <p className="text-red-500 text-xs">{errorMessageDisplay.password}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Verify Password
        </label>
        <input
          type="password"
          name="verifyPassword"
          placeholder="********"
          className="w-full px-3 py-2 border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={verifyPassword}
          onChange={(event) => {
            event.preventDefault()
            onVerifyPasswordChange(event.target.value);
          }}
        />
        {errorMessageDisplay.verifyPassword && (
          <p className="text-red-500 text-xs">
            {errorMessageDisplay.verifyPassword}
          </p>
        )}
      </div>
    </>
  );
};
export default PasswordVerify;
