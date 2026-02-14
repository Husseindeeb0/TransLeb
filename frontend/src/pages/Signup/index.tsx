import { useState } from 'react';
import {
  Mail,
  Lock,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  User,
  Car,
} from 'lucide-react';
import { useSignupMutation } from '../../state/services/auth/authAPI';
import { Link, useNavigate } from 'react-router-dom';
import type { ApiError } from '../../types/api';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Signup = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const navigate = useNavigate();
  const [signup, { isLoading, error: signupError }] = useSignupMutation();
  const error = signupError as ApiError | undefined;

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [role, setRole] = useState<'passenger' | 'driver'>('passenger');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(null);

    if (password !== confirmPassword) {
      setValidationError(t('auth.signup.errors.passwordMismatch'));
      return;
    }

    try {
      await signup({
        name,
        email,
        password,
        role,
      }).unwrap();
      navigate(`/${currentLang}/home`);
    } catch (err) {
      console.error('Signup failed side-effect:', err);
    }
  };

  const getErrorMessage = () => {
    if (validationError) return validationError;
    if (!error) return null;

    if (error.status && Number(error.status) >= 500) {
      return t('auth.signup.errors.server');
    }

    switch (error.data?.state) {
      case 'EMAIL_ALREADY_EXISTS':
        return (
          <div className="flex flex-col items-center gap-1 text-center font-sans">
            <span className="font-semibold text-gray-800">
              {t('auth.signup.errors.emailExists')}
            </span>
            <span className="text-gray-500 text-xs mt-1 leading-relaxed">
              {t('auth.signup.errors.emailExistsDetail')}
            </span>
          </div>
        );
      case 'MISSING_FIELDS':
        return t('auth.signup.errors.missingFields');
      case 'INTERNAL_SERVER_ERROR':
        return t('auth.signup.errors.internal');
      default:
        return (
          error.data?.message ||
          t('auth.signup.errors.failed')
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
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-100/50 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-100/50 rounded-full blur-[120px] animate-pulse" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[500px] relative z-10"
      >
        <div className="bg-white/70 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] p-8 md:px-12 md:py-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] relative overflow-hidden">
          {/* Subtle top glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-red-600 to-green-500 opacity-20" />

          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-br from-green-600 via-emerald-500 to-red-600 rounded-[1.2rem] flex items-center justify-center mx-auto mb-6 shadow-[0_12px_24px_-8px_rgba(16,185,129,0.4)] text-white relative group"
            >
              <UserPlus
                size={30}
                className="group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-white/20 rounded-[1.2rem] opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>

            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
              {t('auth.signup.title')}
            </h1>
            <p className="text-gray-500 font-medium text-sm">
              {t('auth.signup.subtitle')}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {(error || validationError) && (
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

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Role Selection */}
            <motion.div variants={itemVariants} className="space-y-2.5">
              <label className="text-[0.8rem] font-bold text-gray-700 ml-1 tracking-wide uppercase">
                {t('auth.signup.registerAs')}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('passenger')}
                  className={`flex items-center justify-center gap-3 p-3.5 rounded-2xl border-2 transition-all duration-300 ${
                    role === 'passenger'
                      ? 'bg-green-50 border-green-600/30 text-green-700 shadow-sm'
                      : 'bg-gray-50/50 border-gray-100 text-gray-400 hover:border-gray-200'
                  }`}
                >
                  <User
                    size={20}
                    className={
                      role === 'passenger' ? 'animate-bounce-short' : ''
                    }
                  />
                  <span className="font-bold text-sm">{t('auth.signup.passenger')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('driver')}
                  className={`flex items-center justify-center gap-3 p-3.5 rounded-2xl border-2 transition-all duration-300 ${
                    role === 'driver'
                      ? 'bg-red-50 border-red-600/30 text-red-700 shadow-sm'
                      : 'bg-gray-50/50 border-gray-100 text-gray-400 hover:border-gray-200'
                  }`}
                >
                  <Car
                    size={20}
                    className={role === 'driver' ? 'animate-bounce-short' : ''}
                  />
                  <span className="font-bold text-sm">{t('auth.signup.driver')}</span>
                </button>
              </div>
            </motion.div>

            {/* Full Name Input */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-[0.8rem] font-bold text-gray-700 ml-1 tracking-wide uppercase">
                {t('auth.signup.nameLabel')}
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-all duration-300">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  placeholder={t('auth.signup.namePlaceholder')}
                  className="w-full pl-12 pr-5 py-3.5 bg-gray-50/50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-600/5 focus:border-green-600/30 focus:bg-white transition-all text-gray-900 font-medium placeholder:text-gray-400"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </motion.div>

            {/* Email Input */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-[0.8rem] font-bold text-gray-700 ml-1 tracking-wide uppercase">
                {t('auth.signup.emailLabel')}
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-all duration-300">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder={t('auth.signup.emailPlaceholder')}
                  className="w-full pl-12 pr-5 py-3.5 bg-gray-50/50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-600/5 focus:border-green-600/30 focus:bg-white transition-all text-gray-900 font-medium placeholder:text-gray-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </motion.div>

            {/* Password Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password Input */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-[0.8rem] font-bold text-gray-700 ml-1 tracking-wide uppercase">
                  {t('auth.signup.passwordLabel')}
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-all duration-300">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-12 pr-5 py-3.5 bg-gray-50/50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-600/5 focus:border-green-600/30 focus:bg-white transition-all text-gray-900 font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </motion.div>

              {/* Confirm Password Input */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-[0.8rem] font-bold text-gray-700 ml-1 tracking-wide uppercase">
                  {t('auth.signup.confirmLabel')}
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-all duration-300">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-12 pr-5 py-3.5 bg-gray-50/50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-600/5 focus:border-green-600/30 focus:bg-white transition-all text-gray-900 font-medium"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.div variants={itemVariants} className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full py-4 bg-gray-900 text-white rounded-2xl font-bold transition-all duration-300 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2 overflow-hidden"
              >
                {/* Background Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

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
                      <span>{t('auth.signup.submit')}</span>
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
            className="mt-8 pt-8 border-t border-gray-100 text-center"
          >
            <p className="text-gray-500 font-medium">
              {t('auth.signup.hasAccount')}{' '}
              <Link
                to={`/${currentLang}/signin`}
                className="font-bold text-gray-900 hover:text-green-600 transition-colors"
              >
                {t('auth.signup.signinLink')}
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
          {t('auth.copyright')}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Signup;
