import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaLock } from 'react-icons/fa';
import '../assets/css/style.css';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const ResetPassword = () => {
  console.log("apiUrl:", apiUrl);
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!newPassword) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter a new password',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/resetpassword/${id}/${token}`, { password: newPassword });
      setLoading(false);
      if (response.status >= 200 && response.status < 300) {
        Swal.fire({
          title: 'Success!',
          text: 'Your password has been reset successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        navigate('/login');
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to reset password',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="reset-password-section">
        <h3>Set New Password</h3>
        <p>Enter your new password below</p>

        <div className="input-field">
          <FaLock className="input-icon" />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <button
          type="button"
          className="auth-button"
          onClick={handleResetPassword}
          disabled={loading}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
