import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area } from 'recharts';
import { Activity, Brain, GraduationCap, Target, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function StudentDashboard() {
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) {
      fetch(`/api/students/${user.id}`)
        .then(res => res.json())
        .then(data => setStudent(data));
    }
  }, []);

  if (!student) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  const academicData = [
    { name: 'Sem 1', cgpa: 8.2 },
    { name: 'Sem 2', cgpa: 8.4 },
    { name: 'Sem 3', cgpa: 8.1 },
    { name: 'Sem 4', cgpa: student.academics.previousCGPA },
  ];

  const skillData = student.skills.map((s: any) => ({
    subject: s.name,
    A: s.level === 'Advanced' ? 100 : s.level === 'Intermediate' ? 60 : 30,
    fullMark: 100,
  }));

  const stressData = [
    { name: 'Stress', value: student.psychometric.stressLevel },
    { name: 'Motivation', value: student.psychometric.motivationScore },
    { name: 'Focus', value: 85 },
    { name: 'Social', value: 70 },
  ];

  return (
    <div className="space-y-8 pb-12">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Welcome back, <span className="text-blue-600">{student.name.split(' ')[0]}</span>! 👋
          </h1>
          <p className="text-slate-500 font-medium mt-1">Your academic journey is looking promising today.</p>
        </div>
        <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm p-2 rounded-2xl border border-white/20 shadow-sm">
          <div className="bg-blue-100 p-2 rounded-xl">
            <Sparkles className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-sm font-bold text-slate-700 pr-2">AI Ready</span>
        </div>
      </motion.div>

      {/* AI Insight Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-8 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-700" />
        <div className="relative flex flex-col md:flex-row items-start gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-4 rounded-2xl shadow-lg shadow-blue-200">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-wider text-sm">AI Performance Insight</h3>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black rounded-full uppercase">Live Analysis</span>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium text-lg">
              "{student.predictions.aiInsight}"
            </p>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-1 text-blue-600 font-bold text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>8% Improvement expected</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Academic Health', value: `${student.academics.previousCGPA} CGPA`, icon: GraduationCap, color: 'blue', sub: 'Top 15% of class' },
          { label: 'Psychometric', value: student.psychometric.status, icon: Activity, color: 'indigo', sub: 'Stable well-being' },
          { label: 'Skills Growth', value: `${student.skills.length} Active`, icon: Target, color: 'emerald', sub: '2 new this month' },
          { label: 'Risk Assessment', value: student.predictions.riskLevel, icon: AlertCircle, color: 'orange', sub: 'Proactive monitoring' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="glass-card p-6 hover:translate-y-[-4px] transition-all duration-300"
          >
            <div className={`p-3 rounded-2xl w-fit mb-4 bg-${stat.color}-50`}>
              <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-800 mb-1">{stat.value}</p>
            <p className={`text-xs font-bold text-${stat.color}-600/80`}>{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-800">Academic Progression</h3>
            <select className="bg-slate-50 border-none text-xs font-bold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
              <option>Last 4 Semesters</option>
              <option>Yearly View</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={academicData}>
                <defs>
                  <linearGradient id="colorCgpa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontWeight: 600, fontSize: 12}} dy={10} />
                <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontWeight: 600, fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(8px)' }}
                  itemStyle={{ fontWeight: 700, color: '#1e293b' }}
                />
                <Area type="monotone" dataKey="cgpa" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorCgpa)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="glass-card p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-800">Psychometric Balance</h3>
            <div className="flex gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Current</span>
              </div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stressData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontWeight: 600, fontSize: 12}} dy={10} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontWeight: 600, fontSize: 12}} dx={-10} />
                <Tooltip 
                  cursor={{ fill: 'rgba(37, 99, 235, 0.05)' }}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(8px)' }}
                />
                <Bar dataKey="value" fill="#2563eb" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
