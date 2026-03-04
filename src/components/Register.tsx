import { useFormik } from "formik";
import { useState } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import api from "./api";
import { motion } from "framer-motion"; // 1. استيراد المكتبة
import { Helmet } from "react-helmet-async";

interface RegisterValues {
  name: string;
  email: string;
  password: string;
}

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  let navigate = useNavigate();

  // 2. تعريف إعدادات الأنميشن (Variants)
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,   
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  async function signup(values: RegisterValues) {
    setLoading(true);
    const response = await api.post('/auth/signup', values).catch(err => {
      setLoading(false);
      setErrorMsg(err.response?.data?.message || "حدث خطأ ما");
      return null;
    });

    if (response && response.data) {
      if (response.data.message === 'success') {
        navigate('/login');
      }
    }
    setLoading(false);
  }

  let validationSchema = Yup.object({
    name: Yup.string().required('name is required').min(4, 'must less than 4 digites'),
    email: Yup.string().required('email is required').email().matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'email invalid'),
    password: Yup.string().required('password is required').matches(/^[a-zA-Z0-9]{1,10}$/, 'EX:aA1234')
  });

  let formik = useFormik({
    initialValues: { name: '', email: '', password: '' },
    validationSchema,
    onSubmit: signup
  });

  const togglePassword = () => setShowPassword(!showPassword);

  return <>
  <Helmet>
          <title>Register </title>
          <meta name="description" content="Register " />
        </Helmet>
    
    <form onSubmit={formik.handleSubmit} className="mt-5 d-flex flex-column">
      <motion.div 
        className="container register col-md-4 mt-5 br-second shadow-lg p-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible" 
        viewport={{ once: true, amount: 0.2 }} 
      >
        <motion.div variants={itemVariants} className="text-center m-auto mt-2">
          <h3 className="text-white">Register now</h3>
        </motion.div>

        {errorMsg && <div className='alert alert-danger mt-2'>{errorMsg}</div>}

        <motion.div variants={itemVariants}>
          <label htmlFor="name">Name:</label>
          <input value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} type="text" id="name" name="name" className="form-control mb-2" />
          {formik.errors.name && formik.touched.name && <div className='alert alert-danger mt-1'>{formik.errors.name}</div>}
        </motion.div>

        <motion.div variants={itemVariants}>
          <label htmlFor="email">Email:</label>
          <input value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} type="email" id="email" name="email" className="form-control mb-2" />
          {formik.errors.email && formik.touched.email && <div className='alert alert-danger mt-2'>{formik.errors.email}</div>}
        </motion.div>

        <motion.div variants={itemVariants}>
          <label htmlFor="password">Password:</label>
          <div className="d-flex password position-relative">
            <input value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} type={showPassword ? "text" : "password"} id="password" name="password" className="pass form-control mb-2" />
            <span onClick={togglePassword} style={{ cursor: 'pointer', position: 'absolute', right: '10px', top: '10px' }}>
              <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-main`}></i>
            </span>
          </div>
          {formik.errors.password && formik.touched.password && <div className='alert alert-danger mt-2'>{formik.errors.password}</div>}
        </motion.div>

        <motion.div variants={itemVariants} className="text-center m-auto">
          {loading ? (
            <button disabled type='button' className='btn btn-success mt-2 w-75 mb-2'> 
              <i className='fas fa-spinner fa-spin'></i>
            </button>
          ) : (
            <button disabled={!(formik.dirty && formik.isValid)} type='submit' className='btn btn-danger mt-2 mb-2 w-75'>
              Register
            </button>
          )}
        </motion.div>
      </motion.div>
    </form>
  </>
}
