import { useEffect, useState } from 'react';
import { Search, Filter, AlertCircle, CheckCircle, Brain, X, Heart, Sparkles, Activity, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function StudentPsychometric() {
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
    student.registerNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <Heart className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Wellness <span className="text-purple-600">Analytics</span></h1>
          </div>
          <p className="text-slate-500 font-medium">Monitor student mental well-being and emotional health metrics.</p>
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
              placeholder="Search students..."
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
                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Stress Level</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Motivation Score</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Wellness Status</th>
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
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-slate-900 w-8">{student.psychometric.stressLevel}</span>
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${student.psychometric.stressLevel}%` }}
                            className={`h-full rounded-full ${
                              student.psychometric.stressLevel > 70 ? 'bg-red-500' :
                              student.psychometric.stressLevel > 40 ? 'bg-amber-500' :
                              'bg-emerald-500'
                            }`}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-slate-900 w-8">{student.psychometric.motivationScore}</span>
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${student.psychometric.motivationScore}%` }}
                            className={`h-full rounded-full ${
                              student.psychometric.motivationScore < 40 ? 'bg-red-500' :
                              student.psychometric.motivationScore < 70 ? 'bg-amber-500' :
                              'bg-emerald-500'
                            }`}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {student.psychometric.status === 'Needs Counseling' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                          <ShieldAlert className="w-3 h-3" />
                          Needs Counseling
                        </span>
                      ) : student.psychometric.status === 'Mild Stress' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                          <Brain className="w-3 h-3" />
                          Mild Stress
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                          <CheckCircle className="w-3 h-3" />
                          Stable
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => setSelectedStudent(student)}
                        className="px-4 py-2 bg-purple-50 text-purple-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all"
                      >
                        Analyze
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Details Modal */}
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
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-purple-50/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight">Wellness Profile</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedStudent.name}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedStudent(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Stress Level</p>
                    <p className="text-3xl font-black text-slate-900">{selectedStudent.psychometric.stressLevel}<span className="text-sm text-slate-300">/100</span></p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Motivation</p>
                    <p className="text-3xl font-black text-slate-900">{selectedStudent.psychometric.motivationScore}<span className="text-sm text-slate-300">/100</span></p>
                  </div>
                </div>

                <div className={`p-6 rounded-3xl border ${
                  selectedStudent.psychometric.status === 'Needs Counseling' ? 'bg-red-50 border-red-100 text-red-700' :
                  selectedStudent.psychometric.status === 'Mild Stress' ? 'bg-amber-50 border-amber-100 text-amber-700' :
                  'bg-emerald-50 border-emerald-100 text-emerald-700'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldAlert className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Clinical Status</span>
                  </div>
                  <p className="text-xl font-black">{selectedStudent.psychometric.status}</p>
                </div>

                <div className="p-6 bg-purple-50 rounded-3xl border border-purple-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h4 className="text-[10px] font-black text-purple-900 uppercase tracking-widest">AI Recommendation</h4>
                  </div>
                  <p className="text-sm text-purple-800 font-medium leading-relaxed">
                    {selectedStudent.psychometric.status === 'Needs Counseling' 
                      ? "Student shows high stress and low motivation. Immediate counseling session is recommended. Faculty should reach out personally."
                      : selectedStudent.psychometric.status === 'Mild Stress'
                      ? "Student is experiencing some stress. Monitor their progress and suggest stress management workshops or peer support."
                      : "Student is psychologically stable. No immediate action required. Encourage continued healthy work-life balance."}
                  </p>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Dismiss
                </button>
                <button
                  className="flex-1 py-4 bg-purple-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-purple-700 transition-all shadow-lg shadow-purple-200"
                >
                  Schedule Session
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
