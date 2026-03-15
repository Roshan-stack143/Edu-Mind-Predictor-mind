import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, GraduationCap, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Login() {
  const [role, setRole] = useState<'student' | 'faculty'>('student');
  const [registerNumber, setRegisterNumber] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registerNumber, dob, role }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('role', data.role);
        navigate(`/${data.role}/dashboard`);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-700 ${role === 'student' ? 'bg-blue-50' : 'bg-purple-50'}`}>
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: role === 'student' ? 0 : 100
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className={`absolute top-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full blur-3xl opacity-20 ${role === 'student' ? 'bg-blue-400' : 'bg-purple-400'}`} 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            x: role === 'student' ? 0 : -100
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className={`absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full blur-3xl opacity-20 ${role === 'student' ? 'bg-indigo-400' : 'bg-fuchsia-400'}`} 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <motion.div 
            key={role}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`inline-flex p-4 rounded-3xl mb-4 shadow-xl ${role === 'student' ? 'bg-blue-600 shadow-blue-200' : 'bg-purple-600 shadow-purple-200'}`}
          >
            {role === 'student' ? <GraduationCap className="w-10 h-10 text-white" /> : <ShieldCheck className="w-10 h-10 text-white" />}
          </motion.div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
            EduMind <span className={role === 'student' ? 'text-blue-600' : 'text-purple-600'}>Predictor</span>
          </h1>
          <p className="text-slate-500 font-medium">Empowering Education with AI Analytics</p>
        </div>

        <div className="glass-card p-8 border border-white/40 shadow-2xl">
          <div className="flex p-1 bg-slate-100 rounded-2xl mb-8 relative">
            <motion.div 
              animate={{ x: role === 'student' ? 0 : '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`absolute top-1 left-1 bottom-1 w-[calc(50%-4px)] rounded-xl shadow-md ${role === 'student' ? 'bg-blue-600' : 'bg-purple-600'}`}
            />
            <button
              onClick={() => setRole('student')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl relative z-10 transition-colors duration-300 ${role === 'student' ? 'text-white' : 'text-slate-500'}`}
            >
              Student
            </button>
            <button
              onClick={() => setRole('faculty')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl relative z-10 transition-colors duration-300 ${role === 'faculty' ? 'text-white' : 'text-slate-500'}`}
            >
              Faculty
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                {role === 'student' ? 'Register Number' : 'Faculty ID'}
              </label>
              <input
                type="text"
                required
                value={registerNumber}
                onChange={(e) => setRegisterNumber(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 placeholder:text-slate-400"
                style={{ '--tw-ring-color': role === 'student' ? '#2563eb' : '#7c3aed' } as any}
                placeholder={role === 'student' ? 'e.g., REG001' : 'e.g., admin'}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                {role === 'student' ? 'Date of Birth' : 'Password'}
              </label>
              <input
                type={role === 'student' ? 'date' : 'password'}
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300"
                style={{ '--tw-ring-color': role === 'student' ? '#2563eb' : '#7c3aed' } as any}
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-500 text-sm font-bold text-center bg-red-50 py-2 px-4 rounded-xl border border-red-100"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center py-4 px-6 rounded-2xl text-white font-bold shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed ${
                role === 'student' 
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' 
                  : 'bg-purple-600 hover:bg-purple-700 shadow-purple-200'
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 text-center mb-3">Demo Access</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">Student</p>
                <p className="text-[11px] font-medium text-slate-600">732423243002</p>
                <p className="text-[11px] font-medium text-slate-600">2002-05-14</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-purple-600 uppercase mb-1">Faculty</p>
                <p className="text-[11px] font-medium text-slate-600">admin</p>
                <p className="text-[11px] font-medium text-slate-600">admin</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
