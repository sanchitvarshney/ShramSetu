import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { sentOtp } from '@/features/profile/profilePageSlice';

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOtpVerified: (otp: string) => void; // Callback to handle OTP verification
}

const OtpModal: React.FC<OtpModalProps> = ({
  isOpen,
  onClose,
  onOtpVerified,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    // Basic validation for a 6-digit OTP
    if (otp.length === 6 && /^\d+$/.test(otp)) {
      // dispatch(sentOtp(otp))
      onOtpVerified(otp); // Trigger OTP verification callback
      onClose(); // Close modal after submission
    } else {
      setError('Please enter a valid 6-digit OTP.');
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Enter OTP</DialogTitle>
      <DialogDescription>
        A 6-digit OTP has been sent to your email. Please enter it below to
        verify.
      </DialogDescription>
      <Input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        className="mb-4"
        maxLength={6}
        pattern="\d*"
        title="Please enter a 6-digit OTP."
      />
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <Button onClick={handleSubmit} disabled={otp.length !== 6}>
        Verify
      </Button>
      <Button onClick={onClose} variant="outline">
        Cancel
      </Button>
    </Dialog>
  );
};

export default OtpModal;
