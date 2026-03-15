import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Brain, Award, LogOut, User, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function StudentLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const navItems = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Academics', path: '/student/academics', icon: BookOpen },
    { name: 'Skills', path: '/student/skills', icon: Brain },
    { name: 'Achievements', path: '/student/achievements', icon: Award },
    { name: 'Psychometric Test', path: '/student/psychometric', icon: User },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-blue-50/50 student-theme overflow-hidden">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className="w-72 bg-white/80 backdrop-blur-xl border-r border-blue-100 flex flex-col z-20"
      >
        <div className="h-20 flex items-center px-8 border-b border-blue-50">
          <div className="bg-blue-600 p-2 rounded-xl mr-3 shadow-lg shadow-blue-200">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
            EduMind
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
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                      : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`} />
                  {item.name}
                  {isActive && (
                    <motion.div 
                      layoutId="activeNav"
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

        <div className="p-6 border-t border-blue-50 bg-white/50">
          <div className="flex items-center mb-6 p-3 rounded-2xl bg-blue-50/50 border border-blue-100">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold shadow-md">
              {user.name?.charAt(0) || 'S'}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-bold text-slate-800 truncate">{user.name || 'Student'}</p>
              <p className="text-xs text-blue-600 font-medium">{user.registerNumber || 'ID'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-bold text-red-500 rounded-2xl hover:bg-red-50 transition-all duration-300 group"
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
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-indigo-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
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
