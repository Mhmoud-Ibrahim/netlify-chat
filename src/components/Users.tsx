import { useContext } from 'react';
import { UsersList } from './UserList';
import { SocketContext } from './SocketContext';
import ChatLoader from './ChatLoader';
import { Helmet } from 'react-helmet-async';


function Users() {
    const context = useContext(SocketContext);
    if (context?.loading) {
        return <ChatLoader />;
    }

    return <>
    <Helmet>
            <title>Users </title>
            <meta name="description" content="Users " />
          </Helmet>
        <div className="container-fluid min-vh-100 bg-light py-5" style={{ marginTop: '60px' }}>
            <div className="container">
                {/* هيدر الصفحة بتصميم عصري */}
                <div className="row mb-5 animate__animated animate__fadeInDown">
                    <div className="col-12 text-center">
                        <div className="display-5 fw-bold text-success text-uppercase mb-2">
                           
                           Chat Now
                        </div>
                        <p className="text-muted fs-5 fw-medium">
                            <i className="fa-solid fa-users-viewfinder me-2"></i>
                            Welcome to the Chat Now, where you can connect with people from around the world.
                        </p>
                        <div className="mx-auto bg-success  rounded-pill" style={{ width: '80px', height: '5px' }}></div>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-lg-11">
                        <div className="custom-users-page animate__animated animate__fadeInUp">
                            <UsersList />
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                /* تخصيص شكل القائمة لتظهر كـ Cards في صفحة المستخدمين */
                .custom-users-page .card {
                    background: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                }

                .custom-users-page .list-group {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                    background: transparent !important;
                    max-height: none !important; /* إلغاء التمرير الداخلي في هذه الصفحة */
                    overflow: visible !important;
                }

                .custom-users-page .list-group-item {
                    background: white !important;
                    border: 1px solid #f0f0f0 !important;
                    border-radius: 20px !important;
                    padding: 1.25rem !important;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    display: flex;
                    align-items: center;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.04) !important;
                    margin-bottom: 0 !important;
                }

                .custom-users-page .list-group-item:hover {
                    transform: translateY(-8px) scale(1.02);
                    box-shadow: 0 15px 30px rgba(13, 110, 253, 0.1) !important;
                    border-color: #0d6efd !important;
                    z-index: 2;
                }

                /* إخفاء الهيدر الداخلي للـ UsersList لأنه مكرر هنا */
                .custom-users-page .card-header, 
                .custom-users-page h6.p-3 {
                    display: none !important;
                }

                /* تحسين شكل الصورة في الكارت */
                .custom-users-page .rounded-circle {
                    width: 55px !important;
                    height: 55px !important;
                    background: #f8f9fa;
                    border: 2px solid #fff;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }

                .animate__animated {
                    --animate-duration: 0.8s;
                }

                @media (max-width: 768px) {
                    .custom-users-page .list-group {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    </>
}

export default Users;
