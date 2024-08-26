import { Input } from '@/components/ui/input';
import { changePassword } from '@/features/profile/profilePageSlice';
import { AppDispatch } from '@/store';
import { inputStyle } from '@/style/CustomStyles';
import { Label } from '@radix-ui/react-label';
import { useState } from 'react';
import { IoIosLock } from 'react-icons/io';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

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
    let score = 0;
    let label = '';

    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (password.match(/[A-Z]/)) score += 1;
    if (password.match(/[0-9]/)) score += 1;
    if (password.match(/[^a-zA-Z0-9]/)) score += 1;

    switch (score) {
      case 1:
      case 2:
        label = 'Weak';
        break;
      case 3:
        label = 'Medium';
        break;
      case 4:
      case 5:
        label = 'Strong';
        break;
      default:
        label = '';
    }

    setPasswordStrength({ score, label });
  };
  const isFormValid =
    oldPassword &&
    newPassword &&
    confirmPassword &&
    newPassword === confirmPassword &&
    passwordStrength.score >= 3;

  return (
    <div className="pt-10 p-5">
      <div className="w-[70%] mx-auto p-6 border rounded-lg shadow-md float-left">
        <h2 className="text-2xl font-semibold mb-6">Set Your Password</h2>
        <div>
          <p>
            This App password will be required if you want to send contact
            E-mails to the workers from your recruitment E-mail ID.
          </p>
          <p className="mt-2">
            If the App password and recruitment E-mail is not set then the
            contact mails will be sent from our E-mail ID.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* Old Password Field */}
          <div className="floating-label-group p-2 relative">
            <Input
              required
              type={showOldPassword ? 'text' : 'password'}
              className={inputStyle}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <Label className="floating-label gap-[10px]">
              <span className="flex items-center gap-[10px] font-bold">
                <IoIosLock className="h-[18px] w-[18px]" />
                Old Password
              </span>
            </Label>
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              {showOldPassword ? <IoEyeOff /> : <IoEye />}
            </button>
          </div>

          {/* New Password Field */}
          <div className="floating-label-group p-2 relative">
            <Input
              required
              type={showNewPassword ? 'text' : 'password'}
              className={inputStyle}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                checkPasswordStrength(e.target.value);
              }}
            />
            <Label className="floating-label gap-[10px]">
              <span className="flex items-center gap-[10px] font-bold">
                <IoIosLock className="h-[18px] w-[18px]" />
                New Password
              </span>
            </Label>
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <IoEyeOff /> : <IoEye />}
            </button>
          </div>

          {/* Confirm Password Field */}
          <div className="floating-label-group p-2 relative">
            <Input
              required
              type={showConfirmPassword ? 'text' : 'password'}
              className={inputStyle}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Label className="floating-label gap-[10px]">
              <span className="flex items-center gap-[10px] font-bold">
                <IoIosLock className="h-[18px] w-[18px]" />
                Confirm Password
              </span>
            </Label>
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <IoEyeOff /> : <IoEye />}
            </button>
          </div>
          <div>
            <div className="mt-4">
              <p className="font-semibold">Password Strength :</p>
              <div className="relative  bg-gray-200 rounded h-2 mt-1">
                <div
                  className={`h-2 rounded transition-all duration-300 ${
                    passwordStrength.score === 1
                      ? 'bg-red-500 w-1/4'
                      : passwordStrength.score === 2
                      ? 'bg-yellow-500 w-2/4'
                      : passwordStrength.score === 3
                      ? 'bg-blue-500 w-3/4'
                      : passwordStrength.score === 4 ||
                        passwordStrength.score === 5
                      ? 'bg-green-500 w-full'
                      : 'w-0'
                  }`}
                ></div>
              </div>
              <span className="text-sm text-teal-600 mt-2 block">
                {passwordStrength.label}
              </span>
            </div>
            <button
              type="submit"
              className={`py-2 text-white rounded w-[20%] float-right 
                ${
                  isFormValid
                    ? 'bg-teal-500 hover:bg-teal-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              disabled={!isFormValid}
            >
              Set Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetPassword;
