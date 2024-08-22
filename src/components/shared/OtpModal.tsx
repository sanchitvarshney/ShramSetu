import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AppDispatch } from '@/store';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOtpVerified: (otp: string) => void; // Callback to handle OTP verification
}

export default function AlertDialogPopup({
  isOpen,
  onClose,
  onOtpVerified,
}: OtpModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (otp.length === 6 && /^\d+$/.test(otp)) {
      onOtpVerified(otp); 
      onClose(); 
    } else {
      setError('Please enter a valid 6-digit OTP.');
    }
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogTrigger asChild></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Enter OTP</AlertDialogTitle>
          <AlertDialogDescription>
            A 6-digit OTP has been sent to your email. Please enter it below to
            verify.
          </AlertDialogDescription>
        </AlertDialogHeader>
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
        <AlertDialogFooter>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <Button onClick={onClose} variant="outline">
            Skip
          </Button>
          <Button onClick={handleSubmit} disabled={otp.length !== 6}>
            Submit
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
