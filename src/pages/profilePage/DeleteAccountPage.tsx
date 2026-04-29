import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { inputStyle } from '@/style/CustomStyles';

const deleteReasons = [
  'Privacy concerns',
  'Not using this account anymore',
  'Found a better alternative',
  'Too many notifications',
  'Other',
];

const DeleteAccountPage = () => {
  const { id: userId } = useParams<{ id: string }>();
  const [reason, setReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const isOtherReason = reason === 'Other';
  const isFeedbackMissingForOther = isOtherReason && !feedback.trim();

  const handleDeleteAccount = async () => {
    if (!reason) {
      toast({
        title: 'Reason is required',
        description: 'Please select a reason before deleting your account.',
        variant: 'destructive',
      });
      return;
    }
    if (isFeedbackMissingForOther) {
      toast({
        title: 'Feedback is required',
        description:
          'Please enter feedback when you select "Other" as the reason.',
        variant: 'destructive',
      });
      return;
    }

    setIsDeleting(true);
    try {
      // Hook API call here when endpoint is available.
      const payload = {
        userId,
        reason,
        feedback,
      };
      console.log('Delete account request:', payload);

      toast({
        title: 'Delete request submitted',
        description: userId
          ? `Request captured for user ID: ${userId}`
          : 'Request captured without user ID.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 w-full h-full flex items-center justify-center">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="text-[20px] font-[650] text-slate-600 text-center">
            {' '}
            <div>
              <img
                src="/main-logo.svg"
                alt="Logo"
                className="w-[120px] sm:w-[140px] md:w-[200px] h-auto m-auto mb-1"
              />
            </div>
            Delete Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Reason for deleting account *</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className={inputStyle}>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                {deleteReasons.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">
              Other Reason {isOtherReason ? '*' : ''}
            </Label>
            <Textarea
              id="feedback"
              rows={4}
              placeholder="Tell us anything else..."
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
            />
            {isFeedbackMissingForOther ? (
              <p className="text-sm text-red-600">
                Reason is required for "Other" reason.
              </p>
            ) : null}
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700"
              disabled={!reason || isDeleting || isFeedbackMissingForOther}
              onClick={handleDeleteAccount}
            >
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeleteAccountPage;
