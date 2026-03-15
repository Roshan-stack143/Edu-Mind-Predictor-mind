import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, GraduationCap, Trophy, Brain, TrendingUp, ArrowUpRight, Clock, Sparkles, ChevronRight, Search, Download, MoreVertical, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FacultyDashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/students')
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-purple-600" />
      </div>
    </div>
  );

  const totalStudents = students.length;
  const avgCGPA = students.reduce((acc, s) => acc + (s.academics?.previousCGPA || 0), 0) / totalStudents;
  const achievements = students.reduce((acc, s) => acc + (s.achievements?.technical?.length || 0) + (s.achievements?.nonTechnical?.length || 0), 0);
  const supportNeeded = students.filter(s => s.predictions?.academicSupport === 'Needed').length;

  const riskData = [
    { name: 'Low Risk', value: students.filter(s => s.predictions.riskLevel === 'Low Risk').length },
    { name: 'Academic Risk', value: students.filter(s => s.predictions.riskLevel === 'Academic Risk').length },
    { name: 'Psychological Risk', value: students.filter(s => s.predictions.riskLevel === 'Psychological Risk').length },
    { name: 'Both', value: students.filter(s => s.predictions.riskLevel === 'Academic & Psychological Risk').length },
  ];

  const COLORS = ['#8b5cf6', '#f59e0b', '#ef4444', '#4f46e5'];

  const performanceData = students.slice(0, 8).map(s => ({
    name: s.registerNumber.slice(-3),
    cgpa: s.academics.previousCGPA,
    attendance: s.academics.attendance
  }));

  const statCards = [
    { title: 'Total Students', value: totalStudents, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+2 this month' },
    { title: 'Average CGPA', value: avgCGPA.toFixed(2), icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50', trend: 'Top 5% in univ' },
    { title: 'Achievements', value: achievements, icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50', trend: '12 new this week' },
    { title: 'Support Needed', value: supportNeeded, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50', trend: 'Priority attention' }
  ];

  return (
    <div className="space-y-8 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Faculty <span className="text-purple-600">Command Center</span></h1>
          </div>
          <p className="text-slate-500 font-medium text-lg">Welcome back. Here's an overview of your department's performance.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <Search className="h-4 w-4" />
            Search
          </button>
          <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-2xl text-sm font-black hover:bg-purple-700 transition-all shadow-lg shadow-purple-200">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 group hover:border-purple-200 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 ${card.bg} ${card.color} rounded-2xl transition-transform group-hover:scale-110 duration-300`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-emerald-500 font-black text-[10px] bg-emerald-50 px-2 py-1 rounded-lg">
                <TrendingUp className="w-3 h-3" />
                {card.trend}
              </div>
            </div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.title}</h3>
            <div className="text-4xl font-black text-slate-900 tracking-tight">{card.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden"
        >
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Performance Distribution</h2>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-600" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CGPA</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendance</span>
              </div>
            </div>
          </div>
          <div className="p-8 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 800}} dy={10} />
                <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{fill: '#8b5cf6', fontSize: 11, fontWeight: 800}} domain={[0, 10]} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#10b981', fontSize: 11, fontWeight: 800}} domain={[0, 100]} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '16px' }}
                />
                <Bar yAxisId="left" dataKey="cgpa" name="CGPA" fill="#8b5cf6" radius={[8, 8, 0, 0]} barSize={24} />
                <Bar yAxisId="right" dataKey="attendance" name="Attendance %" fill="#10b981" radius={[8, 8, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600">
              <Brain className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Risk Matrix</h2>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-8">
            {riskData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{entry.name}</span>
                </div>
                <span className="text-sm font-black text-slate-900">{entry.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden"
      >
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Performance Leaderboard</h3>
          </div>
          <button className="text-xs font-black text-purple-600 uppercase tracking-widest hover:text-purple-700 flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student ID</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">CGPA</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendance</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.slice(0, 5).map((student) => (
                <tr key={student.id} className="hover:bg-purple-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 font-black text-sm">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900 group-hover:text-purple-700 transition-colors">{student.name}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{student.registerNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-black border ${
                      student.academics.previousCGPA >= 8.5 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                      student.academics.previousCGPA >= 7.5 ? 'bg-purple-50 text-purple-600 border-purple-100' : 
                      'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {student.academics.previousCGPA.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full max-w-[60px] overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${student.academics.attendance}%` }} />
                      </div>
                      <span className="text-xs font-black text-slate-600">{student.academics.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${student.predictions.riskLevel === 'Low Risk' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{student.predictions.riskLevel}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                      <MoreVertical className="w-5 h-5 text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
