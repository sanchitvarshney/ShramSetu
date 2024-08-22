import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogDescription, DialogTitle } from '@/components/ui/dialog';

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OtpModal: React.FC<OtpModalProps> = ({ isOpen, onClose }) => {
  const [otp, setOtp] = useState('');

  const handleSubmit = () => {
    console.log('Submitted OTP:', otp);
    // Handle OTP submission logic
    onClose(); // Close modal after submission
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
      />
      <Button onClick={handleSubmit}>Verify</Button>
      <Button onClick={onClose}>Cancel</Button>
    </Dialog>
  );
};

export default OtpModal;
