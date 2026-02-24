import useToken from '@/hooks/useToken';
import { isAdminOnlyPathFromConfig, CLIENT_FIRST_PATH } from '@/config/appRoutes';
import { getLoggedInUserType, hasLoggedInUserInStorage } from '@/lib/routeAccess';
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
  const hasUserInStorage = hasLoggedInUserInStorage();
  const authStatus = !!token || hasUserInStorage;
  const navigate = useNavigate();
  const location = useLocation();
  const authUser = useSelector((state: RootState) => state.auth?.user);

  useEffect(() => {
    if (authUser?.token) {
      setToken({ token: authUser.token });
    }
  }, [authUser?.token, setToken]);

  useEffect(() => {
    if (authentication && !authStatus) {
      navigate('/login');
    } else if (!authentication && authStatus) {
      const userType = getLoggedInUserType();
      navigate(userType === 'admin' ? '/' : CLIENT_FIRST_PATH, { replace: true });
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
