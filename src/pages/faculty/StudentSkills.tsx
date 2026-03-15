import { useEffect, useState } from 'react';
import { Search, Filter, Award, Code, Globe, Cpu, X, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

export default function StudentSkills() {
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  useEffect(() => {
    fetch('/api/students')
      .then(res => res.json())
      .then(data => setStudents(data));
  }, []);

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.registerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.skills.some((s: any) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getSkillIcon = (category: string) => {
    switch (category) {
      case 'Technical': return <Code className="w-4 h-4" />;
      case 'Soft Skills': return <Globe className="w-4 h-4" />;
      case 'Tools': return <Cpu className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const getSkillData = (student: any) => {
    if (!student || !student.skills) return [];
    return student.skills.map((skill: any) => ({
      name: skill.name,
      proficiency: skill.level === 'Advanced' ? 90 : skill.level === 'Intermediate' ? 70 : 40
    }));
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <Zap className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Skill <span className="text-purple-600">Inventory</span></h1>
          </div>
          <p className="text-slate-500 font-medium">Analyze and track technical competencies across the student body.</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-wrap items-center gap-3 w-full lg:w-auto"
        >
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search students or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Profile</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Top Skills</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Recommended Domain</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredStudents.map((student, idx) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={student.id} 
                    className="group hover:bg-purple-50/30 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center text-purple-700 font-black text-lg shadow-sm">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-black text-slate-900 group-hover:text-purple-700 transition-colors">{student.name}</div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{student.registerNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1.5">
                        {student.skills.slice(0, 3).map((skill: any, sIdx: number) => (
                          <span key={sIdx} className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                            skill.level === 'Advanced' ? 'bg-emerald-50 text-emerald-700' :
                            skill.level === 'Intermediate' ? 'bg-purple-50 text-purple-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {skill.name}
                          </span>
                        ))}
                        {student.skills.length > 3 && (
                          <span className="text-[10px] font-black text-slate-400">+{student.skills.length - 3} more</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center text-purple-700 font-black text-xs uppercase tracking-widest">
                        <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
                        {student.predictions.recommendedDomain}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => setSelectedStudent(student)}
                        className="px-4 py-2 bg-purple-50 text-purple-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all"
                      >
                        View Map
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Skills Radar Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
              onClick={() => setSelectedStudent(null)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-purple-50/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight">Skill Visualization</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedStudent.name}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedStudent(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-[350px] bg-slate-50 rounded-[2rem] p-4 border border-slate-100">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getSkillData(selectedStudent)}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }} />
                      <Radar
                        name="Skills"
                        dataKey="proficiency"
                        stroke="#7c3aed"
                        fill="#7c3aed"
                        fillOpacity={0.5}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Domain Recommendation</h4>
                  </div>
                  
                  <div className="p-6 bg-purple-50 rounded-3xl border border-purple-100 mb-6">
                    <p className="text-xl font-black text-purple-900 mb-1">{selectedStudent.predictions.recommendedDomain}</p>
                    <p className="text-xs text-purple-700 font-medium leading-relaxed">
                      Based on current technical proficiency and academic trajectory, the student is best suited for roles in {selectedStudent.predictions.recommendedDomain}.
                    </p>
                  </div>

                  <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {selectedStudent.skills.map((skill: any, idx: number) => (
                      <div key={idx} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400">
                              {getSkillIcon(skill.category)}
                            </div>
                            <span className="text-xs font-black text-slate-900">{skill.name}</span>
                          </div>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
                            skill.level === 'Advanced' ? 'bg-emerald-50 text-emerald-700' :
                            skill.level === 'Intermediate' ? 'bg-purple-50 text-purple-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>{skill.level}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Close Map
                </button>
                <button
                  className="flex-1 py-4 bg-purple-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-purple-700 transition-all shadow-lg shadow-purple-200"
                >
                  Endorse Skills
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
