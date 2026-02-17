import useToken from '@/hooks/useToken';
import { isAdminOnlyPathFromConfig } from '@/config/appRoutes';
import { getLoggedInUserType } from '@/lib/routeAccess';
import { RootState } from '@/store';
import React, { useEffect, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

interface ProtectedProps {
  children: ReactNode;
  authentication?: boolean;
}

const Protected: React.FC<ProtectedProps> = ({
  children,
  authentication = true,
}) => {
  const { token, setToken } = useToken();
  const authStatus = !!token;
  const navigate = useNavigate();
  const location = useLocation();
  const state = useSelector((state: RootState) => state);

  useEffect(() => {
    if (state.auth?.token) {
      setToken({ token: state.auth.token });
    }
  }, [state.auth?.token, setToken]);

  useEffect(() => {
    if (authentication && !authStatus) {
      navigate('/login');
    } else if (!authentication && authStatus) {
      navigate('/');
    }
  }, [authStatus, authentication, navigate]);

  // Redirect client users from admin-only routes (central config)
  useEffect(() => {
    if (
      authStatus &&
      isAdminOnlyPathFromConfig(location.pathname) &&
      getLoggedInUserType() !== 'admin'
    ) {
      navigate('/', { replace: true });
    }
  }, [authStatus, location.pathname, navigate]);

  return <>{children}</>;
};

export default Protected;
