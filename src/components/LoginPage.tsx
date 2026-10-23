import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Sprout,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ZIMBABWE_LOCATIONS } from '../data/zimbabweLocations';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'developer' | 'farmer';
  title?: string;
  location?: string;
  farmingType?: string;
  hasFacebookAccess: boolean;
  totalPages: number;
}

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser, token: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { isShona, isNdebele } = useTranslation();

  // Mode: 'signin' | 'register'
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');

  // Form Fields
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('Goromonzi (Region IIa)');
  const [farmingType, setFarmingType] = useState<string>('Maize, Groundnuts & Horticulture');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Status
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle Sign In (Intelligent Role Detection on Submit)
  const handleSubmitSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your email or phone number');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password');
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
          email: email.trim(),
          password: password.trim()
        })
      });

      const data = await res.json();
      if (data.success && data.user && data.token) {
        setSuccessMessage(data.message || 'Login successful!');
        setTimeout(() => {
          onLoginSuccess(data.user, data.token);
        }, 350);
      } else {
        setErrorMessage(data.error || 'Invalid credentials. Please verify and try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Quick 1-Click Access for Visiting Smallholder Farmers
  const handleQuickFarmerAccess = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/auth/quick-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success && data.user && data.token) {
        setSuccessMessage('Welcome! Loading agricultural advisory modules...');
        setTimeout(() => {
          onLoginSuccess(data.user, data.token);
        }, 300);
      } else {
        // Fallback local session
        const fallbackUser: AuthUser = {
          id: 'farmer-guest',
          name: 'Visiting Smallholder Farmer',
          email: 'guest@zimfarmers.org',
          role: 'farmer',
          title: 'Smallholder Farmer',
          location: 'Goromonzi (Region IIa)',
          farmingType: 'Field Crops & Horticulture',
          hasFacebookAccess: false,
          totalPages: 13
        };
        onLoginSuccess(fallbackUser, 'farmer_local_token');
      }
    } catch {
      const fallbackUser: AuthUser = {
        id: 'farmer-guest',
        name: 'Visiting Smallholder Farmer',
        email: 'guest@zimfarmers.org',
        role: 'farmer',
        title: 'Smallholder Farmer',
        location: 'Goromonzi (Region IIa)',
        farmingType: 'Field Crops & Horticulture',
        hasFacebookAccess: false,
        totalPages: 13
      };
      onLoginSuccess(fallbackUser, 'farmer_local_token');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Registration
  const handleSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please provide both email and password');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName.trim() || 'Smallholder Farmer',
          email: email.trim(),
          password: password.trim(),
          location: selectedLocation,
          farmingType
        })
      });

      const data = await res.json();
      if (data.success && data.user && data.token) {
        setSuccessMessage('Farmer profile created! Loading dashboard...');
        setTimeout(() => {
          onLoginSuccess(data.user, data.token);
        }, 350);
      } else {
        setErrorMessage(data.error || 'Registration failed');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-emerald-500 selection:text-slate-950">
      {/* Background Decorative Gradient Blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-800/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header Strip */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-lg shadow-lg border border-emerald-400/30">
            🌾
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-2">
              <span>Farmers Dictionary Zw</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold px-2 py-0.5 rounded-full">
                Knowledge Hub
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              {isShona
                ? 'Ruzivo Rwokurima neKupfuya • Zvakadzama muZimbabwe'
                : isNdebele
                ? 'Ezolimo Lokufuya • Ukwaziswa Kwabalimi eZimbabwe'
                : 'Zimbabwe Smallholder Agricultural Knowledge & Advisory Network'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Auth Content Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="max-w-md w-full space-y-6">
          {/* Welcome Announcement */}
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Portal Access</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {authMode === 'signin'
                ? isShona
                  ? 'Pindai muSisitimu'
                  : isNdebele
                  ? 'Ngena kuhlelo'
                  : 'Sign in to Farmers Portal'
                : 'Create Farmer Profile'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
              {authMode === 'signin'
                ? 'Enter your credentials to access personalized planting advisories, market pricing, and agronomy tools.'
                : 'Register your farm profile to receive targeted planting calendars and soil advisories.'}
            </p>
          </div>

          {/* Authentication Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 backdrop-blur-md relative">
            {/* Mode Toggle Bar */}
            <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-extrabold">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  authMode === 'signin'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sprout className="w-3.5 h-3.5" />
                <span>Register</span>
              </button>
            </div>

            {/* Error / Success Notifications */}
            {errorMessage && (
              <div className="p-3.5 bg-rose-950/80 border border-rose-500/50 rounded-2xl text-xs text-rose-200 font-semibold flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-xs text-emerald-200 font-semibold flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Sign In Form */}
            {authMode === 'signin' ? (
              <form onSubmit={handleSubmitSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Email Address or Phone Number
                  </label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email or phone"
                    required
                    autoComplete="username"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-4 pr-11 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 active:from-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-950 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Unlock className="w-4 h-4" />
                  <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* Registration Form */
              <form onSubmit={handleSubmitRegister} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Create Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Farming District
                    </label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                      Primary Enterprise
                    </label>
                    <select
                      value={farmingType}
                      onChange={(e) => setFarmingType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{isLoading ? 'Registering...' : 'Create Farmer Profile'}</span>
                </button>
              </form>
            )}

            {/* Quick 1-Click Access for Smallholder Farmers */}
            <div className="pt-4 border-t border-slate-800 text-center space-y-2.5">
              <span className="text-[11px] text-slate-400 block">
                Visiting without an account?
              </span>
              <button
                type="button"
                onClick={handleQuickFarmerAccess}
                disabled={isLoading}
                className="w-full py-2.5 bg-slate-800/90 hover:bg-slate-800 text-emerald-300 border border-slate-700 hover:border-emerald-500/50 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
              >
                <span>🌾</span>
                <span>Continue as Visiting Farmer</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Strip */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/80 px-4 py-3 text-center text-xs text-slate-500">
        <p>
          Farmers Dictionary Zw • Independent Agro-Ecological Knowledge Base • Natural Regions I - V
        </p>
      </footer>
    </div>
  );
};
