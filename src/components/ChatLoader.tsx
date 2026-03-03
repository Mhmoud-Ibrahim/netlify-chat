// import React, { useState, useEffect } from 'react';

// const ChatLoader: React.FC = () => {
//   const [progress, setProgress] = useState(0);

//   // محاكاة زيادة النسبة المئوية بشكل انسيابي
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setProgress((prev) => (prev < 100 ? prev + 1 : 100));
//     }, 45); // سرعة التحميل (تقريباً 4.5 ثانية للوصول لـ 100%)
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="loader-wrapper vh-100 d-flex align-items-center justify-content-center overflow-hidden">
//       <div className="glass-container p-5 rounded-5 d-flex flex-column align-items-center shadow-2xl">
        
//         {/* حلقة التقدم والأيقونة */}
//         <div className="position-relative mb-4 d-flex align-items-center justify-content-center">
//           <svg width="160" height="160" className="progress-ring">
//             <circle
//               className="progress-ring-circle-bg"
//               stroke="rgba(255,255,255,0.1)"
//               strokeWidth="6"
//               fill="transparent"
//               r="70"
//               cx="80"
//               cy="80"
//             />
//             <circle
//               className="progress-ring-circle"
//               stroke="#fff"
//               strokeWidth="6"
//               strokeDasharray={440} // (2 * PI * r) تقريباً 440 لـ r=70
//               strokeDashoffset={440 - (progress / 100) * 440}
//               strokeLinecap="round"
//               fill="transparent"
//               r="70"
//               cx="80"
//               cy="80"
//             />
//           </svg>
          
//           <div className="position-absolute logo-box d-flex align-items-center justify-content-center bg-white rounded-circle shadow-lg">
//             <i className="fa-solid fa-comments text-primary fa-2xl chat-icon-animate"></i>
//           </div>
//         </div>

//         {/* النسبة المئوية والنص */}
//         <div className="text-center text-white">
//           <div className="percentage-text fw-bold mb-1">{progress}%</div>
//           <h6 className="text-uppercase tracking-widest opacity-75 small fw-bold">جاري فتح المحادثات</h6>
          
//           {/* بار التحميل السفلي الرفيع */}
//           <div className="progress-bar-flat mt-4">
//              <div className="progress-bar-inner" style={{ width: `${progress}%` }}></div>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         .loader-wrapper {
//           background: linear-gradient(-45deg, #4f46e5, #7c3aed, #2563eb, #06b6d4);
//           background-size: 400% 400%;
//           animation: aurora-flow 10s ease infinite;
//         }

//         .glass-container {
//           background: rgba(255, 255, 255, 0.12);
//           backdrop-filter: blur(20px);
//           -webkit-backdrop-filter: blur(20px);
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           width: 320px;
//           box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
//         }

//         .progress-ring { transform: rotate(-90deg); }
//         .progress-ring-circle { transition: stroke-dashoffset 0.2s ease-out; }

//         .logo-box {
//           width: 95px; height: 95px;
//           border: 4px solid rgba(255,255,255,0.3);
//         }

//         .chat-icon-animate {
//           animation: chat-bounce 2s infinite ease-in-out;
//         }

//         .percentage-text {
//           font-size: 2.8rem;
//           font-family: 'Inter', sans-serif;
//           letter-spacing: -2px;
//           text-shadow: 0 4px 10px rgba(0,0,0,0.1);
//         }

//         .progress-bar-flat {
//           width: 140px; height: 4px;
//           background: rgba(255,255,255,0.1);
//           border-radius: 10px; margin: 0 auto; overflow: hidden;
//         }

//         .progress-bar-inner {
//           height: 100%; background: #fff;
//           transition: width 0.3s ease-out;
//           box-shadow: 0 0 8px rgba(255,255,255,0.8);
//         }

//         @keyframes aurora-flow {
//           0% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//           100% { background-position: 0% 50%; }
//         }

//         @keyframes chat-bounce {
//           0%, 100% { transform: scale(1); }
//           50% { transform: scale(1.15) rotate(5deg); }
//         }

//         .tracking-widest { letter-spacing: 0.15em; font-size: 0.75rem; }
//       `}</style>
//     </div>
//   );
// };

// export default ChatLoader;
import React from 'react';

const ChatLoader: React.FC = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-white">
      <div className="chat-loader-container d-flex flex-column gap-2">
        {/* الفقاعة الأولى */}
        <div className="bubble bubble-1 bg-primary opacity-25 rounded-pill shadow-sm"></div>
        {/* الفقاعة الثانية */}
        <div className="bubble bubble-2 bg-primary opacity-50 rounded-pill shadow-sm ms-4"></div>
        {/* الفقاعة الثالثة */}
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
  );
};

export default ChatLoader;
