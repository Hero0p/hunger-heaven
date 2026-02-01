import React from 'react';
import '../../styles/auth-shared.css';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useFlashMessage } from '../../context/FlashMessageContext';

const FoodPartnerLogin = () => {

  const navigate = useNavigate();
  const { showMessage } = useFlashMessage();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await api.post("/auth/food-partner/login", {
        email,
        password
      });

      showMessage('Partner login successful!', 'success');
      navigate("/partner/dashboard"); // Redirect to dashboard after login
    } catch (error) {
      console.error(error);
      showMessage(error.response?.data?.message || 'Login failed. Check credentials.', 'error');
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" role="region" aria-labelledby="partner-login-title">
        <header>
          <h1 id="partner-login-title" className="auth-title">Partner login</h1>
          <p className="auth-subtitle">Access your dashboard and manage orders.</p>
        </header>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="business@example.com" autoComplete="email" />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Password" autoComplete="current-password" />
          </div>
          <button className="auth-submit" type="submit">Sign In</button>
        </form>
        <div className="auth-alt-action">
          New partner? <a href="/food-partner/register">Create an account</a>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;
