import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'motion/react';
import { BookOpen, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Academics() {
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

  return (
    <div className="space-y-8 pb-12">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Academic <span className="text-blue-600">Performance</span></h1>
        <p className="text-slate-500 font-medium mt-1">Detailed breakdown of your scholastic achievements.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 glass-card overflow-hidden"
        >
          <div className="px-8 py-6 border-b border-white/20 flex items-center justify-between bg-white/30">
            <h3 className="text-xl font-black text-slate-800">Semester Overview</h3>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black rounded-full uppercase tracking-wider">Semester 4</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Metric</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Value</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { label: 'Internal Assessment 1', value: `${student.academics.internal1}/100`, status: student.academics.internal1 >= 75 ? 'Excellent' : 'Good', color: 'blue' },
                  { label: 'Internal Assessment 2', value: `${student.academics.internal2}/100`, status: student.academics.internal2 >= 75 ? 'Excellent' : 'Good', color: 'blue' },
                  { label: 'Previous CGPA', value: student.academics.previousCGPA, status: 'Stable', color: 'indigo' },
                  { label: 'Standing Backlogs', value: student.academics.standingBacklogs, status: student.academics.standingBacklogs === 0 ? 'Clear' : 'Action Required', color: student.academics.standingBacklogs === 0 ? 'emerald' : 'red' },
                  { label: 'Attendance', value: `${student.academics.attendance}%`, status: student.academics.attendance >= 75 ? 'Eligible' : 'Low', color: student.academics.attendance >= 75 ? 'emerald' : 'red' },
                ].map((row) => (
                  <tr key={row.label} className="hover:bg-white/40 transition-colors">
                    <td className="px-8 py-5 font-bold text-slate-700">{row.label}</td>
                    <td className="px-8 py-5 font-black text-slate-900">{row.value}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-${row.color}-50 text-${row.color}-600 border border-${row.color}-100`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 bg-gradient-to-br from-blue-600 to-blue-800 text-white border-none"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-black">Quick Stats</h3>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-1">Current Attendance</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${student.academics.attendance}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full ${student.academics.attendance < 75 ? 'bg-red-400' : 'bg-emerald-400'}`}
                    />
                  </div>
                  <span className="font-black text-lg">{student.academics.attendance}%</span>
                </div>
              </div>
              <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-1">Backlogs</p>
                  <p className="text-2xl font-black">{student.academics.standingBacklogs}</p>
                </div>
                <div>
                  <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-1">CGPA</p>
                  <p className="text-2xl font-black">{student.academics.previousCGPA}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 border-blue-100"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <h4 className="font-black text-slate-800 text-sm uppercase tracking-wider">Academic Note</h4>
            </div>
            <p className="text-slate-600 text-sm font-medium leading-relaxed">
              Maintain attendance above 75% to ensure eligibility for end-semester examinations. Your current trend is positive.
            </p>
          </motion.div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-8"
      >
        <h3 className="text-xl font-black text-slate-800 mb-8">Performance Trajectory</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={academicData}>
              <defs>
                <linearGradient id="colorCgpaPage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
              <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dx={-10} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(8px)' }}
                itemStyle={{ fontWeight: 700, color: '#1e293b' }}
              />
              <Area type="monotone" dataKey="cgpa" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorCgpaPage)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
