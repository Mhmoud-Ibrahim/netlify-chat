// import { Link } from 'react-router-dom';
// import 'aos/dist/aos.css';
// import {  useContext } from 'react';
// import { SocketContext } from './SocketContext';

// window.addEventListener('scroll', () => {
//   const nav = document.querySelector('.navbar');
//   if (window.scrollY > 8) {
//     nav?.classList.add('bg-costom', 'shadow');
//   } else {
//     nav?.classList.remove('bg-costom', 'shadow');
//   }
// });

// function Navbar() {
//   const socketContext = useContext(SocketContext);
  
//   if (!socketContext) return null;

//   const { logout, user, notification, clearNotification, setSelectedUser } = socketContext;

//   return (
//     <>
//       <nav className="navbar navbar-expand-lg navbar-light bg-main py-2 text-light fixed-top shadow">
//         <div className="container d-flex align-items-center justify-content-between">
          
//           {/* Logo Section */}
//           <div className="d-flex align-items-center logo-box">
//             <Link className="navbar-brand text-white fw-bold d-flex align-items-center gap-2" to="home">
//               <small>Chat 
//               <i className="fa-solid fa-comment-dots text-success"></i>
//               Now</small>
//             </Link>
//           </div>

//           {/* Navigation Links */}
//           <ul className="navbar-nav d-flex justify-content-center align-items-center flex-row gap-3 me-auto mb-0">
//             <li className="nav-item  btn btn-outline-success rounded-pill py-0 px-1 m-0 fw-bold shadow-sm">
//               <Link className="nav-link text-light" to="home">Home</Link>
//             </li>
//             <li className="nav-item btn btn-outline-success rounded-pill py-0 px-1 m-0 fw-bold shadow-sm">
//               <Link className="nav-link text-light " to="users">Users</Link>
//             </li>
//           </ul>

//           {/* Auth Section: يظهر بناءً على وجود اليوزر */}
//           <div className="d-flex align-items-center ms-auto">
//             {!user ? (
//               // إذا لم يسجل دخول: اظهر Login & Register
//               <ul className="navbar-nav d-flex flex-row gap-2 mb-0">
//                 <li className="nav-item">
//                   <Link className="nav-link btn btn-outline-light btn-sm px-3 text-white border-0" to="login">Login</Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link btn btn-warning btn-sm px-3 text-dark fw-bold" to="register">Register</Link>
//                 </li>
//               </ul>
//             ) : (
  
//               <div className="d-flex justify-content-center align-items-center  gap-3 w-100 w-md-auto">
//                 <Link to="/profile" className="text-decoration-none d-flex align-items-center text-white gap-2">
//                   <div className="rounded-circle overflow-hidden border border-2 border-warning shadow-sm" style={{ width: '38px', height: '38px' }}>
//                     {user.fulluserImage ? (
//                       <img 
//                         src={user.fulluserImage} 
//                         alt="me" 
//                         className="w-100 h-100 object-fit-cover" 
//                       />
//                     ) : (
//                       <div className="w-100 h-100 bg-secondary d-flex align-items-center justify-content-center">
//                         <i className="fa-solid fa-user text-white"></i>
//                       </div>
//                     )}
//                   </div>
//                   <span className="fw-bold small d-none d-md-inline userName">{user.name.split(' ').slice(0,2).join(" ")}</span>
//                 </Link>

//                 <button 
//                   onClick={logout} 
//                   className="logout btn btn-warning btn-sm py-1 rounded-pill px-1 fw-bold shadow-sm"
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//         {notification && (
//           <div 
//             className="position-absolute top-100 start-50 translate-middle-x mt-2 z-3 animate__animated animate__fadeInDown" 
//             style={{ width: '90%', maxWidth: '350px', cursor: 'pointer' }}
//             onClick={() => {
//               if (notification.senderId) {
//                 setSelectedUser(notification.senderId);
//                 clearNotification();
//               }
//             }}
//           >
//             <div className="alert alert-warning shadow-lg border-0 rounded-4 d-flex align-items-center py-2 px-3">
//               <i className="fa-solid fa-envelope-open-text me-2 fs-5 text-primary"></i>
//               <div className="flex-grow-1 overflow-hidden">
//                 <p className="mb-0 small text-dark text-truncate">
//                   <strong>{notification.senderName}:</strong> {notification.msg}
//                 </p>
//               </div>
//               <button onClick={(e) => { e.stopPropagation(); clearNotification(); }} className="btn-close ms-2" style={{ scale: '0.7' }}></button>
//             </div>
//           </div>
//         )}
//       </nav>
//     </>
//   );
// }

// export default Navbar;
import { Link } from 'react-router-dom';
import 'aos/dist/aos.css';
import {  useContext } from 'react';
import { SocketContext } from './SocketContext';

window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (window.scrollY > 8) {
    nav?.classList.add('bg-costom', 'shadow');
  } else {
    nav?.classList.remove('bg-costom', 'shadow');
  }
});

function Navbar() {
  const socketContext = useContext(SocketContext);
  
  if (!socketContext) return null;

  const { logout, user, notification, clearNotification, setSelectedUser } = socketContext;

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-main py-2 text-light fixed-top shadow">
        <div className="container d-flex align-items-center justify-content-between">
          
          {/* Logo Section */}
          <div className="d-flex align-items-center logo-box">
            <Link className="navbar-brand text-white fw-bold d-flex align-items-center gap-2" to="home">
              <small>Chat 
              <i className="fa-solid fa-comment-dots text-success"></i>
              Now</small>
            </Link>
          </div>

          {/* Navigation Links */}
          <ul className="navbar-nav d-flex justify-content-center align-items-center flex-row gap-3 me-auto mb-0">
            <li className="nav-item  btn btn-outline-success rounded-pill py-0 px-1 m-0 fw-bold shadow-sm">
              <Link className="nav-link text-light" to="home">Home</Link>
            </li>
            <li className="nav-item btn btn-outline-success rounded-pill py-0 px-1 m-0 fw-bold shadow-sm">
              <Link className="nav-link text-light " to="users">Users</Link>
            </li>
            {/* إضافة رابط المجموعات هنا */}
            <li className="nav-item btn btn-outline-success rounded-pill py-0 px-1 m-0 fw-bold shadow-sm">
              <Link className="nav-link text-light " to="groups">Groups</Link>
            </li>
          </ul>

          {/* Auth Section: يظهر بناءً على وجود اليوزر */}
          <div className="d-flex align-items-center ms-auto">
            {!user ? (
              // إذا لم يسجل دخول: اظهر Login & Register
              <ul className="navbar-nav d-flex flex-row gap-2 mb-0">
                <li className="nav-item">
                  <Link className="nav-link btn btn-outline-light btn-sm px-3 text-white border-0" to="login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link btn btn-warning btn-sm px-3 text-dark fw-bold" to="register">Register</Link>
                </li>
              </ul>
            ) : (
  
              <div className="d-flex justify-content-center align-items-center  gap-3 w-100 w-md-auto">
                <Link to="/profile" className="text-decoration-none d-flex align-items-center text-white gap-2">
                  <div className="rounded-circle overflow-hidden border border-2 border-warning shadow-sm" style={{ width: '38px', height: '38px' }}>
                    {user.fulluserImage ? (
                      <img 
                        src={user.fulluserImage} 
                        alt="me" 
                        className="w-100 h-100 object-fit-cover" 
                      />
                    ) : (
                      <div className="w-100 h-100 bg-secondary d-flex align-items-center justify-content-center">
                        <i className="fa-solid fa-user text-white"></i>
                      </div>
                    )}
                  </div>
                  <span className="fw-bold small d-none d-md-inline userName">{user.name.split(' ').slice(0,2).join(" ")}</span>
                </Link>

                <button 
                  onClick={logout} 
                  className="logout btn btn-warning btn-sm py-1 rounded-pill px-1 fw-bold shadow-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        {notification && (
          <div 
            className="position-absolute top-100 start-50 translate-middle-x mt-2 z-3 animate__animated animate__fadeInDown" 
            style={{ width: '90%', maxWidth: '350px', cursor: 'pointer' }}
            onClick={() => {
              if (notification.senderId) {
                setSelectedUser(notification.senderId);
                clearNotification();
              }
            }}
          >
            <div className="alert alert-warning shadow-lg border-0 rounded-4 d-flex align-items-center py-2 px-3">
              <i className="fa-solid fa-envelope-open-text me-2 fs-5 text-primary"></i>
              <div className="flex-grow-1 overflow-hidden">
                <p className="mb-0 small text-dark text-truncate">
                  <strong>{notification.senderName}:</strong> {notification.msg}
                </p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); clearNotification(); }} className="btn-close ms-2" style={{ scale: '0.7' }}></button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
