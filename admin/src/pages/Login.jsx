import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, logout } from '../redux/authSlice.js';
import axios from 'axios';
import { Lock, Mail, Phone, ShieldCheck } from 'lucide-react';
import logo from "/logo.png";

const ADMIN_PANEL_ROLES = ['Journalist', 'Editor', 'Advertiser', 'Admin', 'Super Admin'];

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [mode, setMode] = useState('email'); // 'email' or 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpSuccessMsg, setOtpSuccessMsg] = useState('');

  const rejectIfNotStaff = (user) => {
    if (!ADMIN_PANEL_ROLES.includes(user?.role)) {
      dispatch(logout());
      dispatch(loginFailure('Ye account admin panel access ke liye authorized nahi hai.'));
      return false;
    }
    return true;
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(loginStart());
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data.success) {
        dispatch(loginSuccess({ token: res.data.token, user: res.data.user }));
        if (rejectIfNotStaff(res.data.user)) navigate('/');
      }
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || 'Login failed'));
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!phone) return;
    setOtpSending(true);
    try {
      const res = await axios.post('/api/auth/otp/send', { phone });
      if (res.data.success) {
        setOtpSent(true);
        setOtpSuccessMsg(res.data.message || 'OTP sent successfully to your mobile number.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send OTP code. Please try again.');
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!phone || !otpCode) return;
    dispatch(loginStart());
    try {
      const res = await axios.post('/api/auth/otp/verify', { phone, code: otpCode });
      if (res.data.success) {
        dispatch(loginSuccess({ token: res.data.token, user: res.data.user }));
        if (rejectIfNotStaff(res.data.user)) navigate('/');
      }
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || 'Invalid or expired OTP code'));
    }
  };

  const resetOtpMode = () => {
    setOtpSent(false);
    setOtpCode('');
    setOtpSuccessMsg('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-lg shadow-sm space-y-6">

        <div className="text-center space-y-2">
           <img src={logo} alt="IDEACITI Logo" className="h-12 w-auto inline-block" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Admin Panel Sign In</h2>
          <p className="text-xs text-slate-400">Journalist, Editor, Advertiser & Admin access only.</p>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex border-b dark:border-slate-800">
          <button
            onClick={() => { setMode('email'); resetOtpMode(); }}
            className={`flex-1 pb-2 text-xs font-bold text-center border-b-2 transition-colors ${mode === 'email' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-450'}`}
          >
            Email Login
          </button>
          <button
            onClick={() => { setMode('otp'); resetOtpMode(); }}
            className={`flex-1 pb-2 text-xs font-bold text-center border-b-2 transition-colors ${mode === 'otp' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-450'}`}
          >
            Mobile OTP Login
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 text-red-650 text-xs p-3 rounded font-semibold border border-red-150">
            {error}
          </div>
        )}

        {/* Email Login Form */}
        {mode === 'email' && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-2.5 pl-10 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                />
                <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs p-2.5 pl-10 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                />
                <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-2.5 rounded transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Mobile OTP Form */}
        {mode === 'otp' && (
          <form onSubmit={otpSent ? handleVerifyOtp : handleRequestOtp} className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Phone Number</label>
                {otpSent && (
                  <button
                    type="button"
                    onClick={resetOtpMode}
                    className="text-[11px] text-red-600 hover:underline font-semibold"
                  >
                    Change Number
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="tel"
                  required
                  disabled={otpSent}
                  placeholder="+91 XXXXX XXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs p-2.5 pl-10 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-red-600 disabled:opacity-75 disabled:bg-slate-100 dark:disabled:bg-slate-800/60"
                />
                <Phone className="h-4 w-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            {otpSent && (
              <div className="space-y-3">
                {otpSuccessMsg && (
                  <div className="bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 text-xs p-2.5 rounded border border-green-200 dark:border-green-800 flex items-center gap-2">
                    <span className="font-semibold">✓</span>
                    <span>{otpSuccessMsg}</span>
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Enter Verification Code</label>
                  <input
                    type="text"
                    required
                    maxLength="6"
                    placeholder="Enter 6-digit OTP"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full text-xs p-2.5 text-center rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 tracking-widest font-black focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Didn't receive code?</span>
                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    disabled={otpSending}
                    className="text-red-600 hover:underline font-semibold"
                  >
                    {otpSending ? 'Sending...' : 'Resend OTP'}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || otpSending}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-2.5 rounded transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? 'Verifying...' : otpSending ? 'Sending OTP...' : otpSent ? 'Verify OTP & Sign In' : 'Send OTP'}
            </button>
          </form>
        )}


        <div className="text-center text-xs text-slate-500">
          Admin panel ke liye access sirf Journalist, Editor, Advertiser ya Admin role wale accounts ko milta hai.
        </div>

      </div>
    </div>
  );
};

export default Login;
