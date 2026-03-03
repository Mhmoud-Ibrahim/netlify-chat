

import { createHashRouter, RouterProvider } from "react-router-dom";
import Register from "./components/Register.tsx";
import Login from "./components/Login.tsx";

import NotFound from "./components/NotFound";
import Layout from "./components/Layout";


import { SocketProvider } from "./components/SocketContext.tsx";
import { Profile } from "./components/Profile.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { Home } from "./components/Home.tsx";
import Users from "./components/Users.tsx";
import { Toaster } from "react-hot-toast";

function App() {
  let routers = createHashRouter([
    {
      path: '', element: <Layout />, children: [
        { index: true, element: <Home/> },
        { path: 'register', element: <Register /> },
        { path: 'login', element: <Login /> },
        { path: 'home', element: <ProtectedRoute><Home/></ProtectedRoute>  },
        { path: 'users', element:<ProtectedRoute><Users/></ProtectedRoute>},
        { path: 'profile', element: <ProtectedRoute><Profile /></ProtectedRoute> },
        { path: '*', element: <NotFound /> }
      ]
    }
  ])



  return <SocketProvider>
     <Toaster position="top-right" reverseOrder={false} />
    <RouterProvider router={routers} />
  </SocketProvider>
}


export default App
