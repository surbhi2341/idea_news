import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice.js';
import axios from 'axios';
import { User, Mail, Lock, Phone } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Reader');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !password) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/auth/register', {
        name,
        email: email || undefined,
        phone: phone || undefined,
        password,
        role,
      });

      if (res.data.success) {
        dispatch(loginSuccess({ token: res.data.token, user: res.data.user }));
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
    //   <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-lg shadow-sm space-y-6">

    //     <div className="text-center space-y-2">
    //       <div className="inline-block bg-red-600 text-white font-extrabold text-lg px-2 py-0.5 rounded shadow">
    //         IDEACITI NEWS NETWORK
    //       </div>
    //       <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Create New Account</h2>
    //       <p className="text-xs text-slate-400">Join the digital journalism revolution today.</p>
    //     </div>

    //     {error && (
    //       <div className="bg-red-50 dark:bg-red-950/20 text-red-650 text-xs p-3 rounded font-semibold border border-red-150">
    //         {error}
    //       </div>
    //     )}

    //     <form onSubmit={handleSubmit} className="space-y-4">
    //       <div className="space-y-1">
    //         <label className="text-[11px] font-bold text-slate-500 uppercase">Full Name</label>
    //         <div className="relative">
    //           <input
    //             type="text"
    //             required
    //             placeholder="John Doe"
    //             value={name}
    //             onChange={(e) => setName(e.target.value)}
    //             className="w-full text-xs p-2.5 pl-10 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-red-650"
    //           />
    //           <User className="h-4 w-4 text-slate-400 absolute left-3 top-3.5" />
    //         </div>
    //       </div>

    //       <div className="space-y-1">
    //         <label className="text-[11px] font-bold text-slate-500 uppercase">Email Address (Optional)</label>
    //         <div className="relative">
    //           <input
    //             type="email"
    //             placeholder="name@domain.com"
    //             value={email}
    //             onChange={(e) => setEmail(e.target.value)}
    //             className="w-full text-xs p-2.5 pl-10 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-red-650"
    //           />
    //           <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-3.5" />
    //         </div>
    //       </div>

    //       <div className="space-y-1">
    //         <label className="text-[11px] font-bold text-slate-500 uppercase">Phone Number (Optional)</label>
    //         <div className="relative">
    //           <input
    //             type="tel"
    //             placeholder="+91 XXXXX XXXXX"
    //             value={phone}
    //             onChange={(e) => setPhone(e.target.value)}
    //             className="w-full text-xs p-2.5 pl-10 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-red-650"
    //           />
    //           <Phone className="h-4 w-4 text-slate-400 absolute left-3 top-3.5" />
    //         </div>
    //       </div>

    //       <div className="space-y-1">
    //         <label className="text-[11px] font-bold text-slate-500 uppercase">Password</label>
    //         <div className="relative">
    //           <input
    //             type="password"
    //             required
    //             placeholder="Choose a strong password"
    //             value={password}
    //             onChange={(e) => setPassword(e.target.value)}
    //             className="w-full text-xs p-2.5 pl-10 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-red-650"
    //           />
    //           <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-3.5" />
    //         </div>
    //       </div>

    //       <div className="space-y-1">
    //         <label className="text-[11px] font-bold text-slate-500 uppercase">Register As</label>
    //         <select
    //           value={role}
    //           onChange={(e) => setRole(e.target.value)}
    //           className="w-full text-xs p-2.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-850 dark:text-slate-100 focus:outline-none"
    //         >
    //           <option value="Reader">Reader / Citizen</option>
    //           <option value="Journalist">Journalist / Local Reporter</option>
    //           <option value="Advertiser">Advertiser / Promoter</option>
    //         </select>
    //       </div>

    //       <button
    //         type="submit"
    //         disabled={loading}
    //         className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-2.5 rounded transition-colors shadow-sm"
    //       >
    //         {loading ? 'Creating Account...' : 'Sign Up'}
    //       </button>
    //     </form>

    //     <div className="text-center text-xs text-slate-500">
    //       Already have an account? <Link to="/login" className="text-red-655 font-bold hover:underline">Log In</Link>
    //     </div>

    //   </div>
    // </div>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="IDEACITI"
            className="w-64 object-contain"
          />
        </div>

        {/* Banner */}
        <div className="bg-[#F8F1E7] rounded-xl p-5 flex justify-between items-center shadow mb-6">

          <div className="space-y-3 text-gray-700">

            <div className="flex items-center gap-2">
              <span className="text-orange-500 font-bold">✔</span>
              <span>Get Latest News</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-orange-500 font-bold">✔</span>
              <span>Create Free Account</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-orange-500 font-bold">✔</span>
              <span>Personalized News Feed</span>
            </div>

          </div>

          <div className="hidden md:block text-6xl">
            📰
          </div>

        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-6 space-y-4"
        >

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 outline-none focus:border-orange-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 outline-none focus:border-orange-500"
          />

          <div className="flex border rounded-lg overflow-hidden">

            <div className="bg-gray-100 px-4 flex items-center font-semibold">
              🇮🇳 +91
            </div>

            <input
              type="text"
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              className="flex-1 p-3 outline-none"
            />

          </div>

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 outline-none focus:border-orange-500"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 outline-none focus:border-orange-500"
          />

          {/* Privacy */}

          <div className="flex items-start gap-2 text-sm text-gray-600">

            <span>🔒</span>

            <p>
              Your personal information is secure and will only be used for account verification.
            </p>

          </div>

          {/* Terms */}

          <label className="flex gap-2 text-sm">

            <input type="checkbox" required />

            <span>
              I agree to the{" "}
              <a href="#" className="text-blue-600">
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600">
                Privacy Policy
              </a>
            </span>

          </label>

          {/* Register */}

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition"
          >
            Create Account
          </button>

          {/* Login */}

          <p className="text-center text-sm">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-orange-600 font-semibold"
            >
              Login
            </Link>

          </p>

        </form>

      </div>
    </div>
  );
};

export default Register;
