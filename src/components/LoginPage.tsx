import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Sprout,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Mail,
  Shield,
  HelpCircle,
  PhoneCall,
  ArrowLeft
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ZIMBABWE_LOCATIONS } from '../data/zimbabweLocations';
import { TransparencyDocumentModal } from './TransparencyDocumentModal';
import { ZimbabweLiveFlag } from './ZimbabweLiveFlag';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'developer' | 'farmer' | 'agritex_officer' | 'commercial_buyer';
  title?: string;
  badgeNumber?: string;
  location?: string;
  farmingType?: string;
  hasFacebookAccess: boolean;
  totalPages: number;
}

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser, token: string) => void;
  onBackToWebsite?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBackToWebsite }) => {
  const { isShona, isNdebele } = useTranslation();

  // Mode: 'signin' | 'register'
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');

  // Form Fields
  const [emailOrPhone, setEmailOrPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Registration specific fields
  const [fullName, setFullName] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('Goromonzi (Region IIa)');
  const [farmingType, setFarmingType] = useState<string>('Maize, Groundnuts & Horticulture');

  // Status
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);
  const [transparencyModal, setTransparencyModal] = useState<{ isOpen: boolean; doc: 'terms' | 'privacy' | 'ussd' }>({
    isOpen: false,
    doc: 'terms'
  });

  // Handle Standard Sign In
  const handleSubmitSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = emailOrPhone.trim();
    const cleanPass = password.trim();

    if (!cleanId) {
      setErrorMessage('Please enter your email address or mobile phone number.');
      return;
    }
    if (!cleanPass) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanId,
          password: cleanPass
        })
      });

      const data = await res.json();
      if (data.success && data.user && data.token) {
        setSuccessMessage(data.message || 'Authentication successful. Redirecting...');
        if (rememberMe) {
          localStorage.setItem('agri_remember_user', cleanId);
        }
        setTimeout(() => {
          onLoginSuccess(data.user, data.token);
        }, 350);
      } else {
        setErrorMessage(data.error || 'Invalid email/phone or password. Please verify and try again.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Network connection error. Please check your connection.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Standard User Registration
  const handleSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = emailOrPhone.trim();
    const cleanPass = password.trim();
    const cleanName = fullName.trim();

    if (!cleanName) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!cleanId) {
      setErrorMessage('Please enter an email address or mobile phone number.');
      return;
    }
    if (!cleanPass || cleanPass.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          email: cleanId,
          password: cleanPass,
          location: selectedLocation,
          farmingType
        })
      });

      const data = await res.json();
      if (data.success && data.user && data.token) {
        setSuccessMessage('Account registered successfully! Setting up your workspace...');
        setTimeout(() => {
          onLoginSuccess(data.user, data.token);
        }, 400);
      } else {
        setErrorMessage(data.error || 'Registration could not be completed. Please try again.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please check your internet connection.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative selection:bg-emerald-500 selection:text-slate-950 font-sans">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-80 bg-gradient-to-b from-emerald-600/10 via-teal-600/5 to-transparent pointer-events-none blur-3xl"></div>

      {/* Top Header */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-lg shadow-md border border-emerald-400/30">
            🌾
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Farmers Dictionary Zw</span>
              <span className="text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold px-2 py-0.5 rounded-full">
                Portal
              </span>
            </h1>
            <p className="text-[10.5px] text-slate-400 hidden sm:block">
              {isShona
                ? 'Ruzivo Rwokurima neKupfuya muZimbabwe'
                : isNdebele
                ? 'Ezolimo Lokufuya eZimbabwe'
                : 'National Agricultural Knowledge & Advisory Network'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ZimbabweLiveFlag size="sm" showPulseBadge={true} className="hidden sm:inline-flex" />

          {onBackToWebsite && (
            <button
              type="button"
              onClick={onBackToWebsite}
              className="px-3 py-1.5 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Back to Website</span>
              <span className="sm:hidden">Website</span>
            </button>
          )}
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Login / Register Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-md space-y-5">
          {/* Live Zimbabwe National Flag Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
              <ZimbabweLiveFlag size="md" showPulseBadge={true} />
              <div className="text-left leading-tight pr-1">
                <span className="text-xs font-black text-white block">
                  Republic of Zimbabwe
                </span>
                <span className="text-[10px] text-emerald-400 font-bold block">
                  National Agro-Advisory Network
                </span>
              </div>
            </div>
          </div>

          {/* Card Header Text */}
          <div className="text-center space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {authMode === 'signin'
                ? isShona
                  ? 'Pindai muAkaunti Yenyu'
                  : isNdebele
                  ? 'Ngena ku-akhawunti yakho'
                  : 'Welcome back'
                : isShona
                ? 'Gadzirai Akaunti Idzva'
                : isNdebele
                ? 'Qala i-akhawunti entsha'
                : 'Create an account'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
              {authMode === 'signin'
                ? 'Enter your credentials to access your agronomy advisory portal.'
                : 'Register your farm profile to receive tailored planting calendars and pest alerts.'}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-5">
            {/* Status alerts */}
            {errorMessage && (
              <div className="p-3.5 bg-rose-950/80 border border-rose-500/40 rounded-xl text-xs text-rose-200 font-semibold flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 font-semibold flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Sign In Form */}
            {authMode === 'signin' ? (
              <form onSubmit={handleSubmitSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Email address or mobile number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      placeholder="name@domain.com or +263 77..."
                      required
                      autoComplete="username"
                      className="w-full bg-slate-950 border border-slate-700 hover:border-slate-600 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 transition font-medium cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                      className="w-full bg-slate-950 border border-slate-700 hover:border-slate-600 rounded-xl pl-10 pr-11 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 cursor-pointer transition"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span>Remember me on this device</span>
                  </label>
                </div>

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 active:from-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-950/40 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  <Unlock className="w-4 h-4" />
                  <span>{isLoading ? 'Authenticating...' : 'Sign in'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* Registration Form */
              <form onSubmit={handleSubmitRegister} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="w-full bg-slate-950 border border-slate-700 hover:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Email address or mobile phone
                  </label>
                  <input
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="name@domain.com or +263..."
                    required
                    className="w-full bg-slate-950 border border-slate-700 hover:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      required
                      className="w-full bg-slate-950 border border-slate-700 hover:border-slate-600 rounded-xl pl-3.5 pr-11 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Farming district
                    </label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      {ZIMBABWE_LOCATIONS.map((loc) => (
                        <option key={loc.id} value={`${loc.name} (Region ${loc.naturalRegion})`}>
                          {loc.name} (Region {loc.naturalRegion})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Primary enterprise
                    </label>
                    <select
                      value={farmingType}
                      onChange={(e) => setFarmingType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="Maize, Groundnuts & Horticulture">Maize & Horticulture</option>
                      <option value="Traditional Small Grains (Sorghum/Millet)">Small Grains (Region IV/V)</option>
                      <option value="Beef Cattle & Livestock Ranching">Livestock & Cattle</option>
                      <option value="Tobacco & Soya Commercial">Tobacco & Soya</option>
                      <option value="Poultry & Small Ruminants">Poultry & Goats</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-3"
                >
                  <Sprout className="w-4 h-4" />
                  <span>{isLoading ? 'Creating account...' : 'Create account'}</span>
                </button>
              </form>
            )}

            {/* Bottom Toggle Between Sign In and Register */}
            <div className="pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
              {authMode === 'signin' ? (
                <span>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setErrorMessage(null);
                    }}
                    className="text-emerald-400 hover:text-emerald-300 font-bold transition cursor-pointer underline underline-offset-2 ml-1"
                  >
                    Sign up
                  </button>
                </span>
              ) : (
                <span>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setErrorMessage(null);
                    }}
                    className="text-emerald-400 hover:text-emerald-300 font-bold transition cursor-pointer underline underline-offset-2 ml-1"
                  >
                    Sign in
                  </button>
                </span>
              )}
            </div>
          </div>

          {/* Security Badge Strip with Zimbabwe Live Flag */}
          <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 flex-wrap">
            <span className="flex items-center gap-1.5">
              <ZimbabweLiveFlag size="sm" showPulseBadge={false} />
              <span className="font-semibold text-slate-300">Zimbabwe 🇿🇼</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-Bit SSL Encrypted</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Agro-Ecological Guidance</span>
            </span>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2.5 text-white">
              <HelpCircle className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm">Password Reset Assistance</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              If you forgot your password or need assistance accessing your account, please contact the platform administration or use the demo login credentials:
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>Support Desk: support@farmersdictionary.co.zw</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Authorized users may also contact the system administrator directly for credential reset.
              </p>
            </div>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Clean Global Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/90 px-4 py-3.5 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        <span className="font-medium text-slate-400">
          © 2026 Farmers Dictionary Zw • National Agro-Advisory Network
        </span>
        <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium">
          <button
            type="button"
            onClick={() => setTransparencyModal({ isOpen: true, doc: 'terms' })}
            className="hover:text-emerald-400 transition cursor-pointer underline underline-offset-2"
          >
            Terms of Service
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setTransparencyModal({ isOpen: true, doc: 'privacy' })}
            className="hover:text-teal-400 transition cursor-pointer underline underline-offset-2"
          >
            Privacy Policy
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setTransparencyModal({ isOpen: true, doc: 'ussd' })}
            className="hover:text-amber-400 transition cursor-pointer underline underline-offset-2"
          >
            USSD Gateway (*144#)
          </button>
        </div>
      </footer>

      {/* Comprehensive 1,000+ Word Transparency & Legal Governance Modal */}
      <TransparencyDocumentModal
        isOpen={transparencyModal.isOpen}
        initialDoc={transparencyModal.doc}
        onClose={() => setTransparencyModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
