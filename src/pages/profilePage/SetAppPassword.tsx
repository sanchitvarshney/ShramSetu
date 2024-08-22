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
  const [success, setSuccess] = useState('');

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
    dispatch(changePassword(payload))

    // Simulate API call
    setTimeout(() => {
      console.log('Old Password:', oldPassword);
      console.log('New Password:', newPassword);
      setSuccess('Password successfully updated.');
      setError('');
    }, 500);
  };

  const payload ={
    oldPassword:oldPassword,
    newPassword:newPassword,
    confirmPassword:confirmPassword
  }
// const handleSubmit =()=>{

// }
  return (
    <div className="pt-10 p-5">
      <div className="w-[70%] mx-auto p-6 border rounded-lg shadow-md float-left">
        <h2 className="text-2xl font-semibold mb-6">Set Your Password</h2>
        <div>
          <p>
            This App password will be required if you want to send contact
            E-mails to the workers from your recruitment E-mail ID
          </p>

          <p className="mt-2">
            If the App password and recruitment E-mail is not set then the
            contact mails will be sent from our E-mail ID.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}

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
              onChange={(e) => setNewPassword(e.target.value)}
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

          <button
            type="submit"
            className="py-2 bg-teal-500 hover:bg-teal-600 text-white rounded w-[20%] float-right"
          >
            Set Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetPassword;
