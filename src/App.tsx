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
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <MainLayout>
        <HomePage />
      </MainLayout>
    ),
  },
  {
    path: '/employee-list',
    element: (
      <MainLayout>
        <EmployeeData />
      </MainLayout>
    ),
  },
  {
    path: '/company',
    element: (
      <MainLayout>
        <AdminLayout>
          <CompanyPage />
        </AdminLayout>
      </MainLayout>
    ),
  },
  {
    path: '/workers',
    element: (
      <MainLayout>
        <AdminLayout>
          <WorkersPage />
        </AdminLayout>
      </MainLayout>
    ),
  },
  {
    path: '/client-user',
    element: (
      <MainLayout>
        <AdminLayout>
          <ClientUserPage />
        </AdminLayout>
      </MainLayout>
    ),
  },
  {
    path: '/activity-log',
    element: (
      <MainLayout>
        <AdminLayout>
          <ActivityLogPage />
        </AdminLayout>
      </MainLayout>
    ),
  },
  {
    path: '/invitation/whatsapp',
    element: (
      <MainLayout>
        <InvitationPage>
          <WhatsAppInvitationPage />
        </InvitationPage>
      </MainLayout>
    ),
  },
  {
    path: '/invitation/mail',
    element: (
      <MainLayout>
        <InvitationPage>
          <MailInvitationPage />
        </InvitationPage>
      </MainLayout>
    ),
  },
  {
    path: '/invitation/message',
    element: (
      <MainLayout>
        <InvitationPage>
          <MessageInvitationPage />
        </InvitationPage>
      </MainLayout>
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
    </>
  );
}

export default App;
