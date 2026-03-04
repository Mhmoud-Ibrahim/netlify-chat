import React from 'react';
import { Helmet } from 'react-helmet-async';
const ChatLoader: React.FC = () => {
  return <>
  <Helmet>
          <title>please wait ... </title>
          <meta name="description" content="جاري التحميل " />
        </Helmet>
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-white">
      <div className="chat-loader-container d-flex flex-column gap-2">
      <div className="bubble bubble-1 bg-primary opacity-25 rounded-pill shadow-sm"></div>
        <div className="bubble bubble-2 bg-primary opacity-50 rounded-pill shadow-sm ms-4"></div>
        <div className="bubble bubble-3 bg-primary rounded-pill shadow-sm"></div>
      </div>
      
      <div className="mt-4">
        <p className="text-muted fw-medium tracking-tight">جاري التحميل...</p>
      </div>

      <style>{`
        .chat-loader-container {
          width: 80px;
        }
        .bubble {
          height: 12px;
          width: 40px;
          animation: slide-in 1.5s infinite ease-in-out;
        }
        .bubble-1 { animation-delay: 0.1s; width: 30px; }
        .bubble-2 { animation-delay: 0.3s; width: 50px; }
        .bubble-3 { animation-delay: 0.5s; width: 35px; }

        @keyframes slide-in {
          0%, 100% { transform: translateX(-10px); opacity: 0.3; }
          50% { transform: translateX(10px); opacity: 1; }
        }

        .tracking-tight {
          letter-spacing: -0.5px;
          animation: fade 1.5s infinite;
        }

        @keyframes fade {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  </>
};

export default ChatLoader;
