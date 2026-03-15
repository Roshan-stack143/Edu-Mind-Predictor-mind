import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Plus, ExternalLink, Award, Code, Zap, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Skills() {
  const [student, setStudent] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Beginner', link: '' });

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

  const skillData = student.skills.map((s: any) => ({
    subject: s.name,
    A: s.level === 'Advanced' ? 100 : s.level === 'Intermediate' ? 70 : 40,
    fullMark: 100,
  }));

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    setStudent({
      ...student,
      skills: [...student.skills, newSkill]
    });
    setIsAdding(false);
    setNewSkill({ name: '', level: 'Beginner', link: '' });
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Skill <span className="text-blue-600">Profile</span></h1>
          <p className="text-slate-500 font-medium mt-1">Showcase your technical expertise and soft skills.</p>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAdding(true)}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Skill
        </motion.button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="glass-card p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-800">New Competency</h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddSkill} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Skill Name</label>
                  <input
                    type="text"
                    required
                    value={newSkill.name}
                    onChange={e => setNewSkill({ ...newSkill, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 transition-all"
                    placeholder="e.g., TypeScript"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Proficiency</label>
                  <select
                    value={newSkill.level}
                    onChange={e => setNewSkill({ ...newSkill, level: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 transition-all appearance-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Portfolio Link</label>
                  <input
                    type="text"
                    value={newSkill.link}
                    onChange={e => setNewSkill({ ...newSkill, link: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 transition-all"
                    placeholder="github.com/..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-3 font-black text-sm text-slate-500 uppercase tracking-wider hover:text-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-slate-800 transition-all shadow-lg"
                >
                  Confirm Skill
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card overflow-hidden"
        >
          <div className="px-8 py-6 border-b border-white/20 flex items-center justify-between bg-white/30">
            <div className="flex items-center gap-3">
              <Code className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-black text-slate-800">Skill Inventory</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Skill</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Level</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {student.skills.map((skill: any, index: number) => (
                  <tr key={index} className="hover:bg-white/40 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <Zap className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-700">{skill.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                        skill.level === 'Advanced' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        skill.level === 'Intermediate' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                        'bg-slate-50 text-slate-600 border border-slate-100'
                      }`}>
                        {skill.level}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      {skill.link ? (
                        <a 
                          href={skill.link.startsWith('http') ? skill.link : `https://${skill.link}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-wider hover:text-blue-800 transition-colors"
                        >
                          Project <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-300 font-black text-[10px] uppercase tracking-wider">No Link</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <Award className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-black text-slate-800">Competency Radar</h3>
          </div>
          <div className="h-80">
            {skillData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Proficiency"
                    dataKey="A"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fill="#2563eb"
                    fillOpacity={0.3}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(8px)' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
                  <Code className="w-8 h-8 text-slate-300" />
                </div>
                <p className="font-bold">Add skills to visualize your radar chart</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
