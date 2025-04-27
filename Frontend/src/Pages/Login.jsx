import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaLock, FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { useFormik } from 'formik';
import userLoginValidationSchema from '../Validation/userLoginValidationSchema';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../assets/css/style.css';
import { login } from '../store/authSlice.mjs';
import { useDispatch } from 'react-redux';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [resetPassword, setResetPassword] = useState('');
    const [resetId, setResetId] = useState('');
    const [resetToken, setResetToken] = useState('');

    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const id = params.get('id');
        const token = params.get('token');
        if (id && token) {
            setResetId(id);
            setResetToken(token);
            setShowResetPassword(true);
        }
    }, [location]);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: userLoginValidationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            console.log("Form submitted with values:", values);
        
            try {
                console.log('Sending login request to:', `${apiUrl}/login`);
                const response = await axios.post(`${apiUrl}/login`, {
                    email: values.email,
                    password: values.password
                }, {
                    headers: { 'Content-Type': 'application/json' }
                });
        
                console.log('Login response:', response.data);
                setLoading(false);
        
                if (response.status >= 200 && response.status < 300) {
                    localStorage.setItem("token", response.data.token)
                    localStorage.setItem("userID", response.data._id)
                    dispatch(login({
                        token: response.data.token,
                        userID: response.data._id
                    }));
                    Swal.fire({
                        title: 'Success!',
                        text: 'You have logged in successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        navigate('/create-task');
                    });
                }
            } catch (error) {
                console.error('Login error:', error?.response?.data || error.message);
                setLoading(false);
                Swal.fire({
                    title: 'Error!',
                    text: error.response?.data?.message || 'Invalid email or password. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
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
            const response = await axios.post(`${apiUrl}/forget`, {
                email: forgotPasswordEmail
            });

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
            <form onSubmit={formik.handleSubmit} className="auth-form">
                <div className="auth-welcome-section">
                    <div className="welcome-content">
                        <h2>Hello, Welcome!</h2>
                        <p>Don't have an account?</p>
                        <Link to="/" className="auth-link-button">Sign up here</Link>
                    </div>
                </div>

                <div className="auth-form-section">
                    {!showForgotPassword && !showResetPassword && <h1>Login</h1>}

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
                    ) : showResetPassword ? (
                        <div className="reset-password-section">
                            <h3>Set New Password</h3>
                            <p>Enter your new password below</p>

                            <div className="input-field">
                                <FaLock className="input-icon" />
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={resetPassword}
                                    onChange={(e) => setResetPassword(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="button"
                                className="auth-button"
                                onClick={async () => {
                                    if (!resetPassword) {
                                        Swal.fire({
                                            title: 'Error!',
                                            text: 'Please enter a new password',
                                            icon: 'error',
                                            confirmButtonText: 'OK'
                                        });
                                        return;
                                    }
                                    setLoading(true);
                                    try {
                                        const response = await axios.post(`${apiUrl}/resetpassword/${resetId}/${resetToken}`, { password: resetPassword });
                                        setLoading(false);
                                        if (response.status >= 200 && response.status < 300) {
                                            Swal.fire({
                                                title: 'Success!',
                                                text: 'Your password has been reset successfully!',
                                                icon: 'success',
                                                confirmButtonText: 'OK'
                                            });
                                            setShowResetPassword(false);
                                        }
                                    } catch (error) {
                                        setLoading(false);
                                        Swal.fire({
                                            title: 'Error!',
                                            text: error.response?.data?.message || 'Failed to reset password',
                                            icon: 'error',
                                            confirmButtonText: 'OK'
                                        });
                                    }
                                }}
                                disabled={loading}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>

                            <button
                                type="button"
                                className="auth-link-button"
                                onClick={() => setShowResetPassword(false)}
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
