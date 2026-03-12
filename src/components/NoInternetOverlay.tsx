import React, { useEffect, useState } from 'react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Typography } from '@mui/material';

interface NoInternetOverlayProps {
  children: React.ReactNode;
}

/**
 * Wraps the app and shows a full-screen "no internet" overlay when offline.
 * Listens to browser online/offline events.
 */
const NoInternetOverlay: React.FC<NoInternetOverlayProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {children}
      {!isOnline && (
        <div
          className="fixed inset-0 flex flex-col justify-center items-center bg-gray-900/80 z-[1200]"
          aria-live="polite"
          role="alert"
        >
          <Avatar style={{ width: 100, height: 100 }}>
            <AvatarImage src="/no-wifi.png" alt="No internet" />
          </Avatar>
          <Typography
            variant="subtitle2"
            sx={{ fontSize: 22, fontWeight: 500, color: '#fff' }}
          >
            No internet connection. Check your network.
          </Typography>
        </div>
      )}
    </>
  );
};

export default NoInternetOverlay;
