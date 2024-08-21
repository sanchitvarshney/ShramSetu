import './App.scss';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import MainLayout from './Layout/MainLayout';
import Loading from './components/reusable/Loading';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '@ag-grid-community/styles/ag-theme-quartz.css';
import EmployeeData from './pages/EmployeeData';
import AdminLayout from './Layout/AdminLayout';
import CompanyPage from './pages/adminPages/CompanyPage';
import WorkersPage from './pages/adminPages/WorkersPage';
import ClientUserPage from './pages/adminPages/ClientUserPage';
import ActivityLogPage from './pages/adminPages/ActivityLogPage';
import InvitationPage from './pages/invitation/InvitationPage';
import WhatsAppInvitationPage from './components/shared/WhatsAppInvitationPage';
import MailInvitationPage from './components/shared/MailInvitationPage';
import MessageInvitationPage from './components/shared/MessageInvitationPage';
import Protected from '@/components/Protected';
import { Toaster } from '@/components/ui/toaster';
import EmpUpdate from '@/components/ui/EmpUpdate';
import Profile from '@/components/shared/Profile';
import CompanyInfo from '@/components/ui/companyInfo';
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Protected authentication>
        <MainLayout>
          <HomePage />
        </MainLayout>
      </Protected>
    ),
  },
  {
    path: '/employee-list',
    element: (
      <Protected authentication>
        <MainLayout>
          <EmployeeData />
        </MainLayout>
      </Protected>
    ),
  },
  {
    path: '/profile',
    element: (
      <Protected authentication>
        <MainLayout>
          <Profile />
        </MainLayout>
      </Protected>
    ),
  },
  {
    path: '/company/list',
    element: (
      <Protected authentication>
        <MainLayout>
          <AdminLayout>
            <CompanyPage />
          </AdminLayout>
        </MainLayout>
      </Protected>
    ),
  },
  {
    path: '/company/:id',
    element: (
      <Protected authentication>
        <MainLayout>
          <AdminLayout>
            <CompanyInfo />
          </AdminLayout>
        </MainLayout>
      </Protected>
    ),
  },
  {
    path: '/workers',
    element: (
      <Protected authentication>
        <MainLayout>
          <AdminLayout>
            <WorkersPage />
          </AdminLayout>
        </MainLayout>
      </Protected>
    ),
  },
  {
    path: '/client-user',
    element: (
      <Protected authentication>
        <MainLayout>
          <AdminLayout>
            <ClientUserPage />
          </AdminLayout>
        </MainLayout>
      </Protected>
    ),
  },
  {
    path: '/activity-log',
    element: (
      <Protected authentication>
        <MainLayout>
          <AdminLayout>
            <ActivityLogPage />
          </AdminLayout>
        </MainLayout>
      </Protected>
    ),
  },
  {
    path: '/invitation/whatsapp',
    element: (
      <Protected authentication>
        <MainLayout>
          <InvitationPage>
            <WhatsAppInvitationPage />
          </InvitationPage>
        </MainLayout>
      </Protected>
    ),
  },
  {
    path: '/invitation/mail',
    element: (
      <Protected authentication>
        <MainLayout>
          <InvitationPage>
            <MailInvitationPage />
          </InvitationPage>
        </MainLayout>
      </Protected>
    ),
  },
  {
    path: '/invitation/message',
    element: (
      <Protected authentication>
        <MainLayout>
          <InvitationPage>
            <MessageInvitationPage />
          </InvitationPage>
        </MainLayout>
      </Protected>
    ),
  },
  {
    path: '/employee-update/:id',
    element: (
      <Protected authentication>
        <MainLayout>
          <EmpUpdate />
        </MainLayout>
      </Protected>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/loading',
    element: <Loading />,
  },
]);
function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
