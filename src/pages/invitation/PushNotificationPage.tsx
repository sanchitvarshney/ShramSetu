import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { sendNotification } from '@/features/admin/adminPageSlice';
import { inputStyle } from '@/style/CustomStyles';
import { CircularProgress } from '@mui/material';
import { Bell } from 'lucide-react';

const PushNotificationPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.adminPage);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const handleSend = async () => {
    const t = title.trim();
    const m = message.trim();
    if (!t || !m) return;
    const result = await dispatch(sendNotification({ title: t, message: m, image }));
    if (sendNotification.fulfilled.match(result)) {
      setTitle('');
      setMessage('');
      setImage(null);
    }
  };

  const canSend = title.trim() !== '' && message.trim() !== '';

  return (
    <div className="p-6 max-w-2xl">
      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Push Notification
          </CardTitle>
          <CardDescription>
            Send a push notification with a title and message to users.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="notification-title">Title</Label>
            <Input
              id="notification-title"
              className={inputStyle}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notification title"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notification-message">Message</Label>
            <Textarea
              id="notification-message"
              className={inputStyle}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter notification message"
              rows={4}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notification-image">Image (Optional)</Label>
            <Input
              id="notification-image"
              className={inputStyle}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const selectedImage = e.target.files?.[0] || null;
                setImage(selectedImage);
              }}
            />
            {image ? (
              <p className="text-sm text-muted-foreground">{image.name}</p>
            ) : null}
          </div>
          <Button
            onClick={handleSend}
            disabled={!canSend || loading}
            className="bg-[#115e59] hover:bg-[#0d4a46] w-fit"
          >
            {loading ? (
              <CircularProgress size={18} sx={{ color: 'white', mr: 1 }} />
            ) : null}
            Send
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PushNotificationPage;
