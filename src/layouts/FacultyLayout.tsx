import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Brain, Award, LogOut, BookOpen, ChevronRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FacultyLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const navItems = [
    { name: 'Dashboard', path: '/faculty/dashboard', icon: LayoutDashboard },
    { name: 'Student Academics', path: '/faculty/academics', icon: BookOpen },
    { name: 'Psychometric Data', path: '/faculty/psychometric', icon: Brain },
    { name: 'Student Skills', path: '/faculty/skills', icon: Users },
    { name: 'Achievements', path: '/faculty/achievements', icon: Award },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50/50 faculty-theme overflow-hidden">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className="w-72 bg-slate-900 text-white flex flex-col z-20 shadow-2xl"
      >
        <div className="h-20 flex items-center px-8 border-b border-slate-800">
          <div className="bg-purple-600 p-2 rounded-xl mr-3 shadow-lg shadow-purple-900/50">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            EduMind <span className="text-purple-400">Faculty</span>
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group relative flex items-center px-4 py-3 text-sm font-semibold rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-purple-400'}`} />
                  {item.name}
                  {isActive && (
                    <motion.div 
                      layoutId="activeNavFaculty"
                      className="absolute right-4"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center mb-6 p-3 rounded-2xl bg-slate-800/50 border border-slate-700">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold shadow-md">
              {user.name?.charAt(0) || 'F'}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user.name || 'Faculty'}</p>
              <p className="text-xs text-purple-400 font-medium">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-bold text-red-400 rounded-2xl hover:bg-red-400/10 transition-all duration-300 group"
          >
            <LogOut className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
            Logout
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto relative">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-200/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-slate-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <main className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
