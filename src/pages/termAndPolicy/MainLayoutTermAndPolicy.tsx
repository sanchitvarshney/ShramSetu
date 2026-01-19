import { useNavigate } from 'react-router-dom';

const MainLayoutTermAndPolicy = ({ children }: any) => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* header */}
      <div className="w-full h-[60px] flex items-center justify-between px-[20px] border-b border-gray-300 bg-white sticky top-0 z-10">
        <button
          onClick={() => navigate('/login')}
          className="text-foreground hover:text-primary transition-colors cursor-pointer flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          <span className=" sm:block  hidden ">Back to Login</span>
        </button>
        <div>
          <img
            src="/main-logo.svg"
            alt="Logo"
            className="w-[120px] sm:w-[140px] md:w-[200px] h-auto"
          />
        </div>
        <div />
      </div>
      <div>{children}</div>
    </div>
  );
};

export default MainLayoutTermAndPolicy;
