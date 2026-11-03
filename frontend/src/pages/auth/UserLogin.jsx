import React from 'react';
import '../../styles/auth-shared.css';
import api, { setAuthToken } from '../../services/api';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useFlashMessage } from '../../context/FlashMessageContext';
import { useUser } from '../../context/UserContext';

const UserLogin = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { showMessage } = useFlashMessage();
  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await api.post("/auth/user/login", {
        email,
        password
      });

      setAuthToken(response.data.token);
      showMessage('Login successful!', 'success');
      login(response.data.user);
      // Back to where the login was requested from (e.g. liking a reel), else the feed
      navigate(location.state?.from || "/feed");
    } catch (error) {
      console.error(error);
      showMessage(error.response?.data?.message || 'Login failed. Please check your credentials.', 'error');
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" role="region" aria-labelledby="user-login-title">
        <Link to="/" className="auth-brand">HungerHeaven</Link>
        <header>
          <h1 id="user-login-title" className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to continue your food journey.</p>
        </header>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="••••••••" autoComplete="current-password" />
          </div>
          <button className="auth-submit" type="submit">Sign In</button>
        </form>
        <div className="auth-alt-action">
          New here? <Link to="/user/register" state={location.state}>Create account</Link>
        </div>
        <div className="auth-alt-action">
          Own a restaurant? <Link to="/food-partner/login">Partner login</Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
