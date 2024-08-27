import { Input } from '@/components/ui/input';
import { changePassword } from '@/features/profile/profilePageSlice';
import { AppDispatch } from '@/store';
import { inputStyle } from '@/style/CustomStyles';
import { Label } from '@radix-ui/react-label';
import { useState } from 'react';
import { IoIosLock } from 'react-icons/io';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { CheckCircle } from 'lucide-react'; // Import CheckCircle from lucide-react

const SetPassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: '',
  });
  const [passwordChecks, setPasswordChecks] = useState({
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isValidLength: false,
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }
    dispatch(changePassword({ body: payload, type: 'changePassword=true' }));
  };

  const payload: any = {
    oldPassword: oldPassword,
    newPassword: newPassword,
    confirmPassword: confirmPassword,
  };

  const checkPasswordStrength = (password: string) => {
    const checks = {
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[^a-zA-Z0-9]/.test(password),
      isValidLength: password.length >= 8 && password.length <= 16,
    };

    const score = Object.values(checks).filter((check) => check).length;

    setPasswordChecks(checks);

    let label = '';
    if (score <= 2) label = 'Weak';
    else if (score === 3) label = 'Medium';
    else label = 'Strong';

    setPasswordStrength({ score, label });
  };

  const isFormValid =
    oldPassword &&
    newPassword &&
    confirmPassword &&
    newPassword === confirmPassword &&
    passwordStrength.score > 3;

  return (
    <div style={{ backgroundColor: '#f5f5f5' }} className="h-full">
      <div className="flex justify-center pt-10">
        <div className="w-full max-w-5xl  bg-white rounded-lg shadow-lg p-12 flex space-x-12 overflow-y-auto">
          {/* Left Section */}
          <div className="w-1/2">
            <h2 className="text-3xl font-semibold mb-8 text-gray-700">
              Set Your Password
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && <p className="text-red-500 mb-4">{error}</p>}

              {/* Old Password Field */}
              <div className="floating-label-group relative">
                <Input
                  required
                  type={showOldPassword ? 'text' : 'password'}
                  className={`${inputStyle} py-5 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 text-lg`}
                  style={{ height: '3.4rem' }} // Increase height of the input
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <Label className="absolute top-[-0.75rem] left-4 bg-white px-2 text-gray-600 text-lg font-medium">
                  <span className="flex items-center gap-2">
                    <IoIosLock className="h-8 w-8 text-teal-500" />
                    Old Password
                  </span>
                </Label>
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? (
                    <IoEyeOff className="h-8 w-8" />
                  ) : (
                    <IoEye className="h-8 w-8" />
                  )}
                </button>
              </div>

              {/* New Password Field */}
              <div className="floating-label-group relative">
                <Input
                  required
                  type={showNewPassword ? 'text' : 'password'}
                  className={`${inputStyle} py-5 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 text-lg`}
                  style={{ height: '3.5rem' }} // Increase height of the input
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    checkPasswordStrength(e.target.value);
                  }}
                />
                <Label className="absolute top-[-0.75rem] left-4 bg-white px-2 text-gray-600 text-lg font-medium">
                  <span className="flex items-center gap-2">
                    <IoIosLock className="h-8 w-8 text-teal-500" />
                    New Password
                  </span>
                </Label>
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <IoEyeOff className="h-8 w-8" />
                  ) : (
                    <IoEye className="h-8 w-8" />
                  )}
                </button>
              </div>

              {/* Confirm Password Field */}
              <div className="floating-label-group relative">
                <Input
                  required
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`${inputStyle} py-5 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 text-lg`}
                  style={{ height: '3.5rem' }} // Increase height of the input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Label className="absolute top-[-0.75rem] left-4 bg-white px-2 text-gray-600 text-lg font-medium">
                  <span className="flex items-center gap-2">
                    <IoIosLock className="h-8 w-8 text-teal-500" />
                    Confirm Password
                  </span>
                </Label>
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <IoEyeOff className="h-8 w-8" />
                  ) : (
                    <IoEye className="h-8 w-8" />
                  )}
                </button>
              </div>

              <button
                type="submit"
                className={`py-5 text-white rounded-lg w-full mt-8 
                ${
                  isFormValid
                    ? 'bg-teal-500 hover:bg-teal-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!isFormValid}
              >
                Set Password
              </button>
            </form>
          </div>

          {/* Right Section */}
          <div className="w-1/2 pl-12 border-l border-gray-200">
            <h3 className="text-2xl font-semibold mb-6 text-gray-700">
              Password Requirements
            </h3>
            <ul className="space-y-5 text-gray-600 text-lg">
              <li
                className={`flex items-center ${
                  passwordChecks.hasUpperCase
                    ? 'text-green-600'
                    : 'text-gray-500'
                }`}
              >
                {passwordChecks.hasUpperCase ? (
                  <CheckCircle className="h-8 w-8 text-green-600 mr-4" />
                ) : (
                  <div className="h-8 w-8 text-gray-500 mr-4" />
                )}
                <span>At least one uppercase letter</span>
              </li>
              <li
                className={`flex items-center ${
                  passwordChecks.hasNumber ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                {passwordChecks.hasNumber ? (
                  <CheckCircle className="h-8 w-8 text-green-600 mr-4" />
                ) : (
                  <div className="h-8 w-8 text-gray-500 mr-4" />
                )}
                <span>At least one number</span>
              </li>
              <li
                className={`flex items-center ${
                  passwordChecks.hasSpecialChar
                    ? 'text-green-600'
                    : 'text-gray-500'
                }`}
              >
                {passwordChecks.hasSpecialChar ? (
                  <CheckCircle className="h-8 w-8 text-green-600 mr-4" />
                ) : (
                  <div className="h-8 w-8 text-gray-500 mr-4" />
                )}
                <span>At least one special character</span>
              </li>
              <li
                className={`flex items-center ${
                  passwordChecks.isValidLength
                    ? 'text-green-600'
                    : 'text-gray-500'
                }`}
              >
                {passwordChecks.isValidLength ? (
                  <CheckCircle className="h-8 w-8 text-green-600 mr-4" />
                ) : (
                  <div className="h-8 w-8 text-gray-500 mr-4" />
                )}
                <span>8-16 characters in length</span>
              </li>
            </ul>
            <div className="mt-8">
              <p className="text-lg font-semibold text-gray-500">
                Password Strength:
              </p>
              <div className="w-full bg-gray-200 rounded-full mt-2 h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    passwordStrength.label === 'Strong'
                      ? 'bg-green-600'
                      : passwordStrength.label === 'Medium'
                      ? 'bg-yellow-600'
                      : 'bg-red-600'
                  }`}
                  style={{ width: `${passwordStrength.score * 25}%` }}
                />
              </div>
              <p className="text-lg font-semibold text-gray-500 mt-2">
                <span
                  className={`${
                    passwordStrength.label === 'Strong'
                      ? 'text-green-600'
                      : passwordStrength.label === 'Medium'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}
                >
                  {passwordStrength.label}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
