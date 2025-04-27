import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { useFormik } from 'formik';
import userValidationSchema from '../Validation/userValidationSchema'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/style.css';
import Swal from 'sweetalert2';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const Signup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
        },
        validationSchema: userValidationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            console.log('Form submitted with values:', values);
            try {
                const response = await axios.post(`${apiUrl}/signup`, values, { 
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                setLoading(false);
                console.log("response:", response);
                if (response.status >= 200 && response.status < 300) {
                    Swal.fire({
                        title: 'Success!',
                        text: 'You have signed up successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        navigate('/create-task');
                    });
                }
                else {
                    console.log("Error:", response);
                    
                    Swal.fire({
                        title: 'Error!',
                        text: 'Something went wrong. Please try again.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            } catch (error) {
                setLoading(false);
                console.log("Error:", error);
                if (error.response && error.response.status === 409) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Email already exists. Please use a different email.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: 'An error occurred. Please try again later.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            }
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} id="Signup">
            <div className="left">
                <div>
                    <h1>Sign Up</h1>
                    <div className="input-container">
                        <input
                            type="text"
                            name="name"
                            placeholder="Username"
                            {...formik.getFieldProps('name')}
                        />
                        {formik.touched.name && formik.errors.name ? (
                            <div className='error' style={{ color: 'red' }}>{formik.errors.name}</div>) : null}
                        <FaUser className="icon" />
                    </div>

                    <div className="input-container">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            {...formik.getFieldProps('email')}
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <div className='error' style={{ color: 'red' }}>{formik.errors.email}</div>
                        ) : null}
                        <FaEnvelope className="icon" />
                    </div>

                    <div className="input-container">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            {...formik.getFieldProps('password')}
                        />
                        {formik.touched.password && formik.errors.password ? (
                            <div className='error' style={{ color: 'red' }}>{formik.errors.password}</div>) : null}
                        <FaLock className="icon" />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>

                    <p>or sign up with social platforms</p>
                    <div className="social-icons">
                        <a href=""><FaGoogle className="social-icon" /></a>
                        <a href=""><FaFacebookF className="social-icon" /></a>
                        <a href=""><FaGithub className="social-icon" /></a>
                        <a href=""><FaLinkedinIn className="social-icon" /></a>
                    </div>
                </div>
            </div>

            <div className="right">
                <div>
                    <p>Hello, Welcome!</p>
                    <p>Already have an account?</p>
                    <Link to="/login">Login here</Link>
                </div>
            </div>
        </form>
    );
};

export default Signup;
