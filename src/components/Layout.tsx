
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout(){

  const navbarHeight = "3rem";
  return<>
    
      <Navbar />
      {/* هنا بنحسب الطول المتبقي للشاشة بدقة */}
      <main style={{ minHeight: `calc(100vh - ${navbarHeight})` }} className="bg-gray-50">
        <Outlet />
      </main>
    </>
}

export default Layout;