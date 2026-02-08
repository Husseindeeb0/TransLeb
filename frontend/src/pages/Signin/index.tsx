import { useState } from 'react';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck } from 'lucide-react';
import { useLoginMutation } from '../../state/services/auth/authAPI';
import { Link, useNavigate } from 'react-router-dom';
import type { ApiError } from '../../types/api';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';

const Signin = () => {
  const navigate = useNavigate();
  const [login, { isLoading, error: signinError }] = useLoginMutation();
  const error = signinError as ApiError | undefined;
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await login({
        email,
        password,
      }).unwrap();
      navigate('/home');
    } catch (err) {
      console.error('Login failed side-effect:', err);
    }
  };

  const getErrorMessage = () => {
    if (!error) return null;

    if (error.status && Number(error.status) >= 500) {
      return 'Our servers are experiencing issues. Please try again later.';
    }

    switch (error.data?.state) {
      case 'USER_NOT_FOUND':
        return (
          <div className="flex flex-col items-center gap-1 text-center font-sans">
            <span className="font-semibold text-gray-800">
              Account not found
            </span>
            <span className="text-gray-500 text-xs mt-1 leading-relaxed">
              Please check your credentials or{' '}
              <Link
                to="/signup"
                className="text-red-700 hover:text-red-800 underline underline-offset-4 font-bold transition-all"
              >
                create an account
              </Link>{' '}
              if you don't have one.
            </span>
          </div>
        );
      case 'MISSING_FIELDS':
        return 'Please provide both your email and password to sign in.';
      case 'INTERNAL_SERVER_ERROR':
        return 'Something went wrong on our end. Please try again in a moment.';
      default:
        return (
          error.data?.message ||
          'Login failed. Please check your details and try again.'
        );
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#f8fafc]">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-100/50 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-100/50 rounded-full blur-[120px] animate-pulse" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[460px] relative z-10"
      >
        <div className="bg-white/70 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] relative overflow-hidden">
          {/* Subtle top glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-green-500 to-red-600 opacity-20" />

          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-red-700 via-red-600 to-green-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-[0_12px_24px_-8px_rgba(185,28,28,0.4)] text-white relative group"
            >
              <LogIn
                size={36}
                className="group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-white/20 rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>

            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">
              Welcome back
            </h1>
            <p className="text-gray-500 font-medium">
              Securely sign in to your TransLeb account
            </p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="mb-8 p-4 bg-red-50/50 border border-red-100/50 rounded-2xl text-red-600 text-sm flex items-start gap-3"
              >
                <div className="bg-red-100 p-1.5 rounded-lg shrink-0 mt-0.5">
                  <ShieldCheck size={16} className="text-red-600" />
                </div>
                <div className="pt-0.5 leading-relaxed">
                  {getErrorMessage()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-7">
            {/* Email Input */}
            <motion.div variants={itemVariants} className="space-y-2.5">
              <label className="text-[0.85rem] font-bold text-gray-700 ml-1 tracking-wide uppercase">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-700 transition-all duration-300">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-5 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-700/5 focus:border-red-700/30 focus:bg-white transition-all text-gray-900 font-medium placeholder:text-gray-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants} className="space-y-2.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[0.85rem] font-bold text-gray-700 tracking-wide uppercase">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[0.85rem] font-bold text-red-700 hover:text-red-800 transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-700 transition-all duration-300">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-5 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-700/5 focus:border-red-700/30 focus:bg-white transition-all text-gray-900 font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants} className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full py-4.5 bg-gray-900 text-white rounded-2xl font-bold transition-all duration-300 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2 overflow-hidden"
              >
                {/* Background Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 flex items-center gap-2">
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: 'linear',
                      }}
                      className="w-6 h-6 border-[3px] border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight
                        size={20}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </div>
              </button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.div
            variants={itemVariants}
            className="mt-10 pt-10 border-t border-gray-100 text-center"
          >
            <p className="text-gray-500 font-medium">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-bold text-gray-900 hover:text-red-700 transition-colors"
              >
                Create an account
              </Link>
            </p>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center text-gray-400 text-xs font-medium tracking-widest uppercase"
        >
          © 2026 TransLeb • Premium Transportation Services
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Signin;
