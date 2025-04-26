import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { useFormik } from 'formik';
import userValidationSchema from '../Validation/userValidationSchema';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: userValidationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                console.log('Sending login request to:', `${apiUrl}/login`);
                const response = await axios.post(`${apiUrl}/login`, values, {
                    // method: "Post",
                    headers: { 'Content-Type': 'application/json' },
                    // body: JSON.stringify(formData),
                });
                console.log('Login response:', response.data);
                setLoading(false);
                // const data = await response.json()
                if (response.data.success) {
                    localStorage.setItem("token", response.data.token)
                    localStorage.setItem("userID", response.data._id)
                    Swal.fire({
                        title: 'Success!',
                        text: 'You have logged in successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                }
            } catch (error) {
                setLoading(false);
                if (error.response && error.response.status === 401) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Invalid email or password. Please try again.',
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
        },
    });
  

    const handleForgotPassword = async () => {
        if (!forgotPasswordEmail) {
            Swal.fire({
                title: 'Error!',
                text: 'Please enter your email address',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        try {
            setLoading(true);
            // // const response = await axios.post(`${apiUrl}/forgot-password`, {
            //     email: forgotPasswordEmail
            // });

            setLoading(false);
            if (response.status >= 200 && response.status < 300) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Password reset link has been sent to your email!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                setShowForgotPassword(false);
            }
        } catch (error) {
            setLoading(false);
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Failed to send reset link',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit= {(e)=>{e.preventDefault(); formik.handleSubmit(e)}} className="auth-form">
                <div className="auth-welcome-section">
                    <div className="welcome-content">
                        <h2>Hello, Welcome!</h2>
                        <p>Don't have an account?</p>
                        <Link to="/" className="auth-link-button">Sign up here</Link>
                    </div>
                </div>

                <div className="auth-form-section">
                    {!showForgotPassword && <h1>Login</h1>}

                    {showForgotPassword ? (
                        <div className="forgot-password-section">
                            <h3>Reset Password</h3>
                            <p>Enter your email to receive a reset link</p>

                            <div className="input-field">
                                <FaEnvelope className="input-icon" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={forgotPasswordEmail}
                                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                />
                            </div>

                            <button
                                type="button"
                                className="auth-button"
                                onClick={handleForgotPassword}
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>

                            <button
                                type="button"
                                className="auth-link-button"
                                onClick={() => setShowForgotPassword(false)}
                            >
                                Back to Login
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="input-field">
                                <FaEnvelope className="input-icon" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    {...formik.getFieldProps('email')}
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <div className="error-message">{formik.errors.email}</div>
                                )}
                            </div>

                            <div className="input-field">
                                <FaLock className="input-icon" />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    {...formik.getFieldProps('password')}
                                />
                                {formik.touched.password && formik.errors.password && (
                                    <div className="error-message">{formik.errors.password}</div>
                                )}
                            </div>

                            <div className="forgot-password-link">
                                <button
                                    type="button"
                                    className="text-button"
                                    onClick={() => setShowForgotPassword(true)}
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            <button type="submit" className="auth-button" disabled={loading}>
                                {loading ? 'Logging In...' : 'Login'}
                            </button>

                            <div className="auth-divider">
                                <span>or login with</span>
                            </div>

                            <div className="social-auth">
                                <button type="button" className="social-button">
                                    <FaGoogle />
                                </button>
                                <button type="button" className="social-button">
                                    <FaFacebookF />
                                </button>
                                <button type="button" className="social-button">
                                    <FaGithub />
                                </button>
                                <button type="button" className="social-button">
                                    <FaLinkedinIn />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Login;