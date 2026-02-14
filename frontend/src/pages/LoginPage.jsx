import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../contexts/LocaleContext';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const { t } = useLocale();
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [loginState, setLoginState] = useState({ email: '', password: '' });
  const [registerState, setRegisterState] = useState({
    fullName: '',
    email: '',
    password: '',
    requestedRole: 'architect',
  });

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await login(loginState);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await register(registerState);
      setMessage(t('accountPending'));
      setMode('login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="container section-spacing auth-layout">
      <div className="auth-switcher">
        <button
          type="button"
          className={mode === 'login' ? 'active' : ''}
          onClick={() => setMode('login')}
        >
          {t('signInTitle')}
        </button>
        <button
          type="button"
          className={mode === 'register' ? 'active' : ''}
          onClick={() => setMode('register')}
        >
          {t('signUpTitle')}
        </button>
      </div>

      {error ? <p className="error-text">{error}</p> : null}
      {message ? <p className="success-text">{message}</p> : null}

      {mode === 'login' ? (
        <form className="form-card" onSubmit={handleLogin}>
          <label>
            {t('email')}
            <input
              type="email"
              value={loginState.email}
              onChange={(event) =>
                setLoginState((prev) => ({ ...prev, email: event.target.value }))
              }
              required
            />
          </label>

          <label>
            {t('password')}
            <input
              type="password"
              value={loginState.password}
              onChange={(event) =>
                setLoginState((prev) => ({ ...prev, password: event.target.value }))
              }
              required
            />
          </label>

          <button type="submit" className="btn-primary">
            {t('submit')}
          </button>
        </form>
      ) : (
        <form className="form-card" onSubmit={handleRegister}>
          <label>
            {t('fullName')}
            <input
              value={registerState.fullName}
              onChange={(event) =>
                setRegisterState((prev) => ({ ...prev, fullName: event.target.value }))
              }
              required
            />
          </label>

          <label>
            {t('email')}
            <input
              type="email"
              value={registerState.email}
              onChange={(event) =>
                setRegisterState((prev) => ({ ...prev, email: event.target.value }))
              }
              required
            />
          </label>

          <label>
            {t('password')}
            <input
              type="password"
              minLength={8}
              value={registerState.password}
              onChange={(event) =>
                setRegisterState((prev) => ({ ...prev, password: event.target.value }))
              }
              required
            />
          </label>

          <label>
            {t('role')}
            <select
              value={registerState.requestedRole}
              onChange={(event) =>
                setRegisterState((prev) => ({ ...prev, requestedRole: event.target.value }))
              }
            >
              <option value="authorized_dealer">{t('authorizedDealer')}</option>
              <option value="architect">{t('architect')}</option>
              <option value="press">{t('press')}</option>
            </select>
          </label>

          <p>{t('roleHint')}</p>

          <button type="submit" className="btn-primary">
            {t('submit')}
          </button>
        </form>
      )}
    </section>
  );
}
