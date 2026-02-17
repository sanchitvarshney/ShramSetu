import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './store';
import { ConfigProvider } from 'antd';

ReactDOM.createRoot(document.getElementById('root')!).render(
  
  <Provider store={store}>
    <ConfigProvider
      theme={{
        token: {
          colorBorder: "#d1d5db",
          colorPrimary: "#14b8a6",
        },
        components: {
          DatePicker: {
            activeBorderColor: "#14b8a6",
            cellRangeBorderColor: "#f0f0f0",
            cellHoverWithRangeBg: "#f0f0f0",
            cellHoverBg: "#f0f0f0",
            hoverBorderColor: "#d1d5db",
            activeShadow: "0 0 0 0 rgba(5, 145, 255, 0.1)",
          },
        },
      }}
    >
    <App /></ConfigProvider>
  </Provider>,
);
