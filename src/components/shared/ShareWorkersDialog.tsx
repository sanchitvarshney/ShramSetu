import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker, TimePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import { isPlaceholderDisplayValue } from '@/lib/utils';
import { AppDispatch, RootState } from '@/store';
import { getJobsList, shareWorkers } from '@/features/admin/adminPageSlice';
import { inputStyle } from '@/style/CustomStyles';
import { CircularProgress } from '@mui/material';
import { toast } from '@/components/ui/use-toast';
import { notifyUserApplication } from '@/features/jobFeatures/jobApplicationsSlice';

export interface SelectedWorkerItem {
  empCode: string;
  mobile: string;
  name: string;
  externalId: string;
}

/** Parse WhatsApp API error string (JSON) to a short readable message. */
function parseWhatsAppError(errorStr: string): string {
  if (!errorStr?.trim()) return 'Unknown error';
  try {
    const parsed = JSON.parse(errorStr);
    const msg = parsed?.error?.message ?? parsed?.error?.error_data?.details ?? parsed?.message;
    return typeof msg === 'string' ? msg : errorStr;
  } catch {
    return errorStr.length > 80 ? errorStr.slice(0, 80) + '…' : errorStr;
  }
}

/** Ensure mobile has country code 91 (India). Prepends 91 if not present. */
function normalizeMobileWith91(mobile: string): string {
  const s = (mobile ?? '')
    .trim()
    .replace(/^\+/, '')
    .replace(/^\s+|\s+$/g, '');
  if (!s) return s;
  const digits = s.replace(/\D/g, '');
  if (digits.startsWith('91')) return digits;
  return '91' + digits;
}

interface ShareWorkersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedWorkers: SelectedWorkerItem[];
  onSuccess?: () => void;
}

const ShareWorkersDialog: React.FC<ShareWorkersDialogProps> = ({
  open,
  onOpenChange,
  selectedWorkers,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobsList, loadingJob } = useSelector(
    (state: RootState) => state.adminPage,
  );
  const [jobId, setJobId] = useState<any>('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);
  const [notifyType, setNotifyType] = useState<'whatsapp' | 'app'>('whatsapp');
  const [appTitle, setAppTitle] = useState('');
  const [appMessage, setAppMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (open) {
      dispatch(getJobsList());
      setJobId('');
      setContact('');
      setAddress('');
      setSelectedDate(null);
      setSelectedTime(null);
      setNotifyType('whatsapp');
      setAppTitle('');
      setAppMessage('');
      setSending(false);
    }
  }, [open]);

  const handleShare = async () => {
    if (notifyType === 'app') {
      console.log(selectedWorkers,"data")
      const playerIds = selectedWorkers
        .map((w:any) => w.externalId)
      
      

      const t = appTitle.trim();
      const m = appMessage.trim();

      if (playerIds.length === 0) {
        toast({
          variant: 'destructive',
          title: 'No valid users',
          description: 'Selected users are missing id for app notification.',
        });
        return;
      }
      if (!t || !m) return;

      setSending(true);
      try {
        await dispatch(
          notifyUserApplication({
            title: t,
            message: m,
            playerIds,
          }),
        ).unwrap();
        toast({
          title: 'Success',
          description: `App notification sent to ${playerIds.length} user(s).`,
        });
        onOpenChange(false);
        onSuccess?.();
      } catch (err: any) {
        toast({
          variant: 'destructive',
          title: 'Notification failed',
          description: err?.message ?? 'Failed to send app notification.',
        });
      } finally {
        setSending(false);
      }
      return;
    }

    // WhatsApp flow
    if (!jobId.trim()) return;
    if (!contact.trim()) return;
    if (!address.trim()) return;
    if (!selectedDate) {
      toast({
        variant: 'destructive',
        title: 'Select date',
        description: 'Please select a date.',
      });
      return;
    }
    if (!selectedTime) {
      toast({
        variant: 'destructive',
        title: 'Select time',
        description: 'Please select a time.',
      });
      return;
    }
    const workersWithMobile = selectedWorkers.filter(
      (w) => w.empCode && (w.mobile ?? '').trim() !== '',
    );
    const empCode = workersWithMobile.map((w) => w.empCode);
    const mobile = workersWithMobile.map((w) =>
      normalizeMobileWith91(w.mobile ?? ''),
    );
    const name = workersWithMobile.map((w) => {
      const n = (w.name ?? '').trim();
      return isPlaceholderDisplayValue(n) ? '' : n;
    });
    if (empCode.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No valid workers',
        description:
          'Selected workers have no mobile number. Add mobile and try again.',
      });
      return;
    }

    const dateStr = selectedDate.format('DD-MM-YYYY');
    const timeStr = selectedTime.format('HH:mm');

    const result = await dispatch(
      shareWorkers({
        empCode,
        mobile,
        empName: name,
        jobId: jobId.trim(),
        address: address.trim(),
        contact: contact.trim(),
        date: dateStr,
        time: timeStr,
      }),
    );

    if (shareWorkers.fulfilled.match(result)) {
      const res = result.payload as {
        success: boolean;
        message: string;
        total: number;
        sent: number;
        failed: number;
        failedUsers?: Array<{
          empCode: string;
          mobile: string;
          error: string;
        }>;
      };
      const { sent, failed, failedUsers = [] } = res;

      // No failures: { success: true, sent: 1, failed: 0, failedUsers: [] }
      if (sent > 0 && failed === 0) {
        toast({
          title: 'Success',
          description: res.message || `Sent to ${sent} worker(s).`,
        });
        onOpenChange(false);
        onSuccess?.();
      } else if (sent > 0 && failed > 0) {
        const failedSummary = failedUsers
          .map((u) => `${u.empCode}: ${parseWhatsAppError(u.error)}`)
          .join('; ');
        toast({
          variant: 'destructive',
          title: 'Partially sent',
          description: `Sent: ${sent}, Failed: ${failed}. ${failedSummary || res.message}`,
        });
        onOpenChange(false);
        onSuccess?.();
      } else if (failed > 0) {
        const failedSummary = failedUsers
          .map((u) => `${u.empCode}: ${parseWhatsAppError(u.error)}`)
          .join('; ');
        toast({
          variant: 'destructive',
          title: 'Send failed',
          description:
            failedSummary || res.message || 'No messages could be sent.',
        });
      }
    }
  };

  const whatsappCanShare =
    jobId.trim() !== '' &&
    contact.trim() !== '' &&
    address.trim() !== '' &&
    selectedDate !== null &&
    selectedTime !== null &&
    selectedWorkers.length > 0;

  const appPlayerIds = selectedWorkers
    .map((w) => w.empCode)
    .map((id) => id?.toString().trim())
    .filter(Boolean);

  const appCanSend =
    appTitle.trim() !== '' &&
    appMessage.trim() !== '' &&
    appPlayerIds.length > 0 &&
    selectedWorkers.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notify workers</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm text-muted-foreground">
            {selectedWorkers.length} worker(s) selected. Fill details and click
            Send.
          </p>
          <div className="grid gap-2">
            <Label>Send via</Label>
            <Select value={notifyType} onValueChange={(v:any) => setNotifyType(v)}>
              <SelectTrigger className={inputStyle}>
                <SelectValue placeholder="Select channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="app">App notification</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            {notifyType === 'whatsapp' ? (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="share-company">Job</Label>
                  <Select value={jobId} onValueChange={setJobId}>
                    <SelectTrigger id="share-company" className={inputStyle}>
                      <SelectValue placeholder="Select Job" />
                    </SelectTrigger>
                    <SelectContent>
                      {(jobsList ?? []).map(
                        (c: {
                          designationName: string;
                          departmentName: string;
                          uniqueID: string;
                        }) => (
                          <SelectItem
                            key={c.departmentName}
                            value={c.uniqueID}
                          >
                            {c.departmentName} - {c.designationName}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="share-contact">Contact</Label>
                  <Input
                    id="share-contact"
                    className={inputStyle}
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Enter contact"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="share-address">Address</Label>
                  <Textarea
                    id="share-address"
                    className={inputStyle}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter address"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Date</Label>
                  <DatePicker
                    value={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    className="w-full"
                    format="DD-MM-YYYY"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Time</Label>
                  <TimePicker
                    value={selectedTime}
                    onChange={(time) => setSelectedTime(time)}
                    className="w-full"
                    format="HH:mm"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="app-title">Title</Label>
                  <Input
                    id="app-title"
                    className={inputStyle}
                    value={appTitle}
                    onChange={(e) => setAppTitle(e.target.value)}
                    placeholder="Enter notification title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="app-message">Message</Label>
                  <Textarea
                    id="app-message"
                    className={inputStyle}
                    value={appMessage}
                    onChange={(e) => setAppMessage(e.target.value)}
                    placeholder="Enter notification message"
                    rows={4}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-[#115e59] hover:bg-[#0d4a46]"
            onClick={handleShare}
            disabled={
              notifyType === 'whatsapp'
                ? !whatsappCanShare || loadingJob
                : !appCanSend || sending
            }
          >
            {(loadingJob || sending) && (
              <CircularProgress size={16} sx={{ color: 'white', mr: 1 }} />
            )}
            {notifyType === 'whatsapp' ? 'Send' : 'Send'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareWorkersDialog;
