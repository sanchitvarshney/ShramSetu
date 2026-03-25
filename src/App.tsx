import './App.scss';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import MainLayout from './Layout/MainLayout';
import Loading from './components/reusable/Loading';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '@ag-grid-community/styles/ag-theme-quartz.css';
import EmployeeData from './pages/EmployeeData';
import AdminLayout from './Layout/AdminLayout';

import InvitationPage from './pages/invitation/InvitationPage';
import WhatsAppInvitationPage from './components/shared/WhatsAppInvitationPage';
import MailInvitationPage from './components/shared/MailInvitationPage';
import MessageInvitationPage from './components/shared/MessageInvitationPage';
import PushNotificationPage from './pages/invitation/PushNotificationPage';
import Protected from '@/components/Protected';
import NoInternetOverlay from '@/components/NoInternetOverlay';
import { Toaster } from '@/components/ui/toaster';
import EmpUpdate from '@/components/ui/EmpUpdate';
import CompanyInfo from '@/components/ui/companyInfo';
import ProfilePage from '@/pages/profilePage/ProfilePage';
import SetAppPassword from '@/pages/profilePage/SetAppPassword';
import ProfileLayout from './Layout/ProfileLayout';
import PageNotFound from './pages/PageNotFound';
import JobLayout from './Layout/JobLayout';
import JobAddPage from './pages/jobPages/JobAddPage';
import JobListPage from './pages/jobPages/JobListPage';
import JobApplicationsPage from './pages/jobPages/JobApplicationsPage';
import TermAndCondition from './pages/termAndPolicy/TermAndCondition';
import MainLayoutTermAndPolicy from './pages/termAndPolicy/MainLayoutTermAndPolicy';
import PrivacyPolicy from './pages/termAndPolicy/PrivacyPolicy';
import { ErrorBoundary } from 'react-error-boundary';
import FallBackUI from './components/error/FallBackUI';
import RootLayout from './Layout/RootLayout';
import ClientUserPage from './pages/adminPages/ClientUserPage';
import ListCompany from './components/shared/ListCompany';
import PendingCompanyList from './components/shared/PendingCompanyList';
import AddCompany from './components/shared/AddCompany';
import AddWorker from './components/shared/AddWorker';
import ListWorker from './components/shared/ListWorker';
import AddBranch from './components/shared/AddBranch';
import WorkerLayout from './Layout/WorkerLayout';
import AddDepartment from './components/master/AddDepartment';
import MasterLayout from './Layout/MasterLayout';
import AddDesignation from './components/master/AddDesignation';
import ListDesignations from './components/master/ListDesignations';
import ListDepartments from './components/master/ListDepartments';
import ListContractor from './components/shared/ListContractor';
import AddContractor from './components/shared/AddContractor';
import ContractorLayout from './Layout/ContractorLayout';
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <FallBackUI />,
    children: [
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
              <ProfileLayout>
                <ProfilePage />
              </ProfileLayout>
            </MainLayout>
          </Protected>
        ),
      },
      {
        path: '/profile/set-password',
        element: (
          <Protected authentication>
            <MainLayout>
              <ProfileLayout>
                <SetAppPassword />
              </ProfileLayout>
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
                <ListCompany />
              </AdminLayout>
            </MainLayout>
          </Protected>
        ),
      },
      {
        path: '/company/create',
        element: (
          <Protected authentication>
            <MainLayout>
              <AdminLayout>
                <AddCompany />
              </AdminLayout>
            </MainLayout>
          </Protected>
        ),
      },
      {
        path: '/company/pending-list',
        element: (
          <Protected authentication>
            <MainLayout>
              <AdminLayout>
                <PendingCompanyList />
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
        path: '/workers/create',
        element: (
          <Protected authentication>
            <MainLayout>
              <WorkerLayout>
                <AddWorker />
              </WorkerLayout>
            </MainLayout>
          </Protected>
        ),
      },
      {
        path: '/workers/list',
        element: (
          <Protected authentication>
            <MainLayout>
              <WorkerLayout>
                <ListWorker />
              </WorkerLayout>
            </MainLayout>
          </Protected>
        ),
      },
      {
        path: '/branch/add',
        element: (
          <Protected authentication>
            <MainLayout>
              <WorkerLayout>
                <AddBranch />
              </WorkerLayout>
            </MainLayout>
          </Protected>
        ),
      },
      {
        path: '/contractor/list',
        element: (
          <Protected authentication>
            <MainLayout>
              <ContractorLayout>
                <ListContractor />
              </ContractorLayout>
            </MainLayout>
          </Protected>
        ),
      },
      {
        path: '/contractor/add',
        element: (
          <Protected authentication>
            <MainLayout>
              <ContractorLayout>
                <AddContractor />
              </ContractorLayout>
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
      // {
      //   path: '/activity-log',
      //   element: (
      //     <Protected authentication>
      //       <MainLayout>
      //         <AdminLayout>
      //           <ActivityLogPage />
      //         </AdminLayout>
      //       </MainLayout>
      //     </Protected>
      //   ),
      // },
      {
        path: '/department/create',
        element: (
          <Protected authentication>
            <MainLayout>
              <MasterLayout>
                <AddDepartment />
              </MasterLayout>
            </MainLayout>
          </Protected>
        ),
      },
      {
        path: '/department/list',
        element: (
          <Protected authentication>
            <MainLayout>
              <MasterLayout>
                <ListDepartments />
              </MasterLayout>
            </MainLayout>
          </Protected>
        ),
      },
      {
        path: '/designation/create',
        element: (
          <Protected authentication>
            <MainLayout>
              <MasterLayout>
                <AddDesignation />
              </MasterLayout>
            </MainLayout>
          </Protected>
        ),
      },
      {
        path: '/designation/list',
        element: (
          <Protected authentication>
            <MainLayout>
              <MasterLayout>
                <ListDesignations />
              </MasterLayout>
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
        path: '/push-notification',
        element: (
          <Protected authentication>
            <MainLayout>
              <PushNotificationPage />
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
        path: '/job/job-create',
        element: (
          <Protected authentication>
            <MainLayout>
              <JobLayout>
                <JobAddPage />
              </JobLayout>
            </MainLayout>
          </Protected>
        ),
      },
      {
        path: '/job/job-list',
        element: (
          <Protected authentication>
            <MainLayout>
              <JobLayout>
                <JobListPage />
              </JobLayout>
            </MainLayout>
          </Protected>
        ),
      },
      {
        path: '/job/job-applications',
        element: (
          <Protected authentication>
            <MainLayout>
              <JobLayout>
                <JobApplicationsPage />
              </JobLayout>
            </MainLayout>
          </Protected>
        ),
      },
      {
        path: '/terms-of-service',
        element: (
          <MainLayoutTermAndPolicy>
            <TermAndCondition />
          </MainLayoutTermAndPolicy>
        ),
      },
      {
        path: '/privacy-policy',
        element: (
          <MainLayoutTermAndPolicy>
            <PrivacyPolicy />
          </MainLayoutTermAndPolicy>
        ),
      },
      {
        path: '/login',
        element: (
          <Protected authentication={false}>
            <Login />
          </Protected>
        ),
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: '/reset-password',
        element: <ResetPassword />,
      },
      {
        path: '/loading',
        element: <Loading />,
      },
      {
        path: '*',
        element: <PageNotFound />,
      },
    ],
  },
]);
function App() {
  return (
    <NoInternetOverlay>
      <ErrorBoundary
        fallbackRender={FallBackUI}
        onError={(error, info) => {
          console.error(error, info);
        }}
      >
        <RouterProvider router={router} />
        <Toaster />
      </ErrorBoundary>
    </NoInternetOverlay>
  );
}

export default App;
