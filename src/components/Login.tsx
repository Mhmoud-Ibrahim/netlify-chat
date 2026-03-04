
// import { useFormik } from "formik"
// import { useContext, useState } from 'react'
// import *as Yup from 'yup';
// //import { useNavigate } from 'react-router-dom';
// import api from "./api";
// import { SocketContext } from "./SocketContext";
// import { useNavigate } from "react-router-dom";



// interface LoginValues {
//   email: string;
//   password: string;
// }

// export default function Login() {

//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const socketContext = useContext(SocketContext);
//   if (!socketContext) return null;
//   const {  setUser } = socketContext

//    let navigate = useNavigate()

//   async function signin(values: LoginValues) {
//     const response = await api.post('/auth/signin', values).catch(err => {
//       setLoading(false);
//       setErrorMsg(err.response?.data?.message || "there is an error");
//       return null;
//     });

//     if (response && response.data) {
//       const data = response.data;
//       if (data.message === 'success') {
//         console.log(data);
//         localStorage.setItem("token",response.data.token);
//         setUser(data.user);
//         navigate('/');
        
       
//       }
//     }
//   }
//   let validationSchema = Yup.object({
//     email: Yup.string().required('email is required').email().matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'email invalid EX: nnn50@gamil.com'),
//     password: Yup.string().required('password is required').matches(/^[a-zA-Z0-9]{1,10}$/, 'EX:aA1234')
//   })

//   let formik = useFormik({
//     initialValues: {
//       email: '',
//       password: '',
//     }, validationSchema,
//     onSubmit: signin
//   })
//   const togglePassword = () => {
//     setShowPassword(!showPassword);
//   };


//   return <>


//     <form onSubmit={formik.handleSubmit} className="mt-5 d-flex flex-column "  >
//       <div className="container login col-md-4 mt-5 br-second">
//         <div className="  text-center m-auto mt-5">
//           <h3 className="text-white" >Login now</h3>
//         </div>
//         {errorMsg ? <div className='alert alert-danger mt-2'>{errorMsg}</div> : null}

//         <label htmlFor="email" >Email:</label>
//         <input value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} type="email" id="email" name="email" className="form-control mb-2 " />
//         {formik.errors.email && formik.touched.email ? <div className='alert alert-danger mt-2'>{formik.errors.email}</div> : null}

//         <label htmlFor="password" >password:</label>
//         <div className="d-flex password position-relative">
//           <input value={formik.values.password} onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             type={showPassword ? "text" : "password"}
//             id="password" name="password"
//             className="pass form-control mb-2 " />
//           <span onClick={togglePassword} style={{ cursor: 'pointer' }}>
//             <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-main`}></i>
//           </span>
//         </div>  {formik.errors.password && formik.touched.password ? <div className='alert alert-danger mt-2'>{formik.errors.password}</div> : null}

//         <div className="text-center m-auto" >

//           {loading ? <button disabled={!(formik.dirty && formik.isValid)} type='button' className='btn btn-success mt-2 w-75 mb-2 '> <i className='fas fa-spinner fa-spin' ></i></button>
//             : <button disabled={!(formik.dirty && formik.isValid)} type='submit' className='btn btn-danger mt-2 mb-2 w-75 '>Login</button>}

//         </div>
//       </div>
//     </form>

//   </>
// }
import { useFormik } from "formik";
import { useContext, useState } from 'react';
import * as Yup from 'yup';
import api from "./api";
import { SocketContext } from "./SocketContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // استيراد موشن

interface LoginValues {
  email: string;
  password: string;
}

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const socketContext = useContext(SocketContext);
  const navigate = useNavigate();

  if (!socketContext) return null;
  const { setUser } = socketContext;

  // إعدادات الحركة
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4, staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  async function signin(values: LoginValues) {
    setLoading(true);
    setErrorMsg('');
    const response = await api.post('/auth/signin', values).catch(err => {
      setLoading(false);
      setErrorMsg(err.response?.data?.message || "there is an error");
      return null;
    });

    if (response?.data?.message === 'success') {
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      navigate('/');
    }
    setLoading(false);
  }

  let validationSchema = Yup.object({
    email: Yup.string().required('email is required').email(),
    password: Yup.string().required('password is required')
  });

  let formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: signin
  });

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <form onSubmit={formik.handleSubmit} className="mt-5 d-flex flex-column">
      <motion.div 
        className="container login col-md-4 mt-5 br-second p-4 shadow"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible" // يعمل عند الفتح والسكرول
        viewport={{ once: true }}
      >
        <motion.div variants={itemVariants} className="text-center m-auto mt-2">
          <h3 className="text-white">Login now</h3>
        </motion.div>

        {/* حركة سلسة لظهور رسالة الخطأ */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className='alert alert-danger mt-2'
            >
              {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={itemVariants} className="mt-3">
          <label htmlFor="email">Email:</label>
          <input value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} type="email" id="email" name="email" className="form-control mb-2" />
          {formik.errors.email && formik.touched.email && <div className='text-danger mb-2'>{formik.errors.email}</div>}
        </motion.div>

        <motion.div variants={itemVariants}>
          <label htmlFor="password">Password:</label>
          <div className="d-flex password position-relative">
            <input value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} type={showPassword ? "text" : "password"} id="password" name="password" className="pass form-control mb-2" />
            <span onClick={togglePassword} style={{ cursor: 'pointer', position: 'absolute', right: '10px', top: '10px' }}>
              <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-main`}></i>
            </span>
          </div>
          {formik.errors.password && formik.touched.password && <div className='text-danger mb-2'>{formik.errors.password}</div>}
        </motion.div>

        <motion.div variants={itemVariants} className="text-center m-auto">
          <motion.button 
            whileHover={{ scale: 1.02 }} // تكبير بسيط عند الوقوف بالماوس
            whileTap={{ scale: 0.95 }}   // تصغير عند الضغط
            disabled={!(formik.dirty && formik.isValid) || loading}
            type='submit' 
            className={`btn ${loading ? 'btn-success' : 'btn-danger'} mt-2 mb-2 w-75`}
          >
            {loading ? <i className='fas fa-spinner fa-spin'></i> : 'Login'}
          </motion.button>
        </motion.div>
      </motion.div>
    </form>
  );
}
