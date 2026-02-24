import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useRef } from 'react';

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOtpVerified: (otp: string) => void; // Callback to handle OTP verification
}

export default function OtpModal({
  isOpen,
  onClose,
  onOtpVerified,
}: OtpModalProps) {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '', '', '']);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to the next input
      if (value.length === 1 && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const otpString = otp.join('');
    if (otpString.length === 8 && /^\d+$/.test(otpString)) {
      onOtpVerified(otpString);
      onClose();
    } else {
      setError('Please enter a valid 8-digit OTP.');
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogTrigger asChild></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Enter OTP</AlertDialogTitle>
          <AlertDialogDescription>
            A 8-digit OTP has been sent to your email. Please enter it below to
            verify.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex space-x-2 mb-4">
          {otp?.map((value, index) => (
            <Input
              key={index}
              type="text"
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              placeholder="-"
              className="w-12 text-center"
              maxLength={1}
              pattern="\d*"
              title="Please enter a single digit."
              ref={(el) => (inputRefs.current[index] = el)}
            />
          ))}
        </div>
        <AlertDialogFooter>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <Button onClick={onClose} variant="outline">
            Skip
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={otp.join('').length !== 8}
            className="bg-[#115e59] hover:bg-[#0d4a46]"
          >
            Submit
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
