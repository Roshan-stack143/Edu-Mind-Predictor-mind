import { useEffect, useState } from 'react';
import { Search, Filter, AlertCircle, CheckCircle2, Download, MoreVertical, ChevronRight, GraduationCap, X, BookOpen, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function StudentAcademics() {
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

  const getPerformanceColor = (cgpa: number) => {
    if (cgpa >= 9) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (cgpa >= 8) return 'text-purple-600 bg-purple-50 border-purple-100';
    if (cgpa >= 7) return 'text-blue-600 bg-blue-50 border-blue-100';
    return 'text-amber-600 bg-amber-50 border-amber-100';
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
              <GraduationCap className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Academic <span className="text-purple-600">Registry</span></h1>
          </div>
          <p className="text-slate-500 font-medium">Monitor performance metrics and AI-driven success predictions.</p>
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
              placeholder="Search by name or register number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-purple-600 text-white rounded-2xl text-sm font-black hover:bg-purple-700 transition-all shadow-lg shadow-purple-200">
            <Download className="h-4 w-4" />
            Export
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
                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Internal 1</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Internal 2</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Current CGPA</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Backlogs</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Prediction</th>
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
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center text-purple-700 font-black text-lg shadow-sm">
                            {student.name.charAt(0)}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                            student.predictions.academicSupport === 'Needed' ? 'bg-amber-500' : 'bg-emerald-500'
                          }`} />
                        </div>
                        <div>
                          <div className="text-sm font-black text-slate-900 group-hover:text-purple-700 transition-colors">{student.name}</div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{student.registerNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-slate-600">{student.academics.internal1}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-slate-600">{student.academics.internal2}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 text-xs font-black rounded-full border ${getPerformanceColor(student.academics.previousCGPA)}`}>
                          {student.academics.previousCGPA.toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1">
                        <span className={`text-sm font-black ${student.academics.standingBacklogs > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                          {student.academics.standingBacklogs}
                        </span>
                        {student.academics.backlogHistory > 0 && (
                          <span className="text-[10px] font-bold text-slate-300">({student.academics.backlogHistory} total)</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {student.predictions.academicSupport === 'Needed' ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                          <AlertCircle className="w-3 h-3" />
                          Support Needed
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                          <CheckCircle2 className="w-3 h-3" />
                          On Track
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setSelectedStudent(student)}
                          className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-100 rounded-xl transition-all"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 rounded-xl transition-all">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredStudents.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-lg font-black text-slate-800">No students found</h3>
              <p className="text-slate-400 font-medium">Try adjusting your search terms or filters.</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Academic Details Modal */}
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
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-purple-50/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight">Academic Transcript</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedStudent.name}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedStudent(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current CGPA</p>
                      <div className="flex items-end gap-2">
                        <span className="text-3xl font-black text-slate-900">{selectedStudent.academics.previousCGPA.toFixed(2)}</span>
                        <TrendingUp className="w-5 h-5 text-emerald-500 mb-1" />
                      </div>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Attendance</p>
                      <div className="flex items-end gap-2">
                        <span className="text-3xl font-black text-slate-900">{selectedStudent.academics.attendance || 85}%</span>
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-1" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                    <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Internal Assessment</h4>
                    </div>
                    <div className="p-6 grid grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-500">Internal 1</span>
                          <span className="text-sm font-black text-slate-900">{selectedStudent.academics.internal1} / 50</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(selectedStudent.academics.internal1 / 50) * 100}%` }}
                            className="h-full bg-purple-500"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-500">Internal 2</span>
                          <span className="text-sm font-black text-slate-900">{selectedStudent.academics.internal2} / 50</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(selectedStudent.academics.internal2 / 50) * 100}%` }}
                            className="h-full bg-purple-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-purple-600 rounded-3xl text-white shadow-lg shadow-purple-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">AI Prediction</span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed opacity-90">
                      {selectedStudent.predictions.academicSupport === 'Needed' 
                        ? "Student requires immediate academic intervention. Focus on improving Internal 2 scores."
                        : "Student is performing well. Potential candidate for advanced placement and research."}
                    </p>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Backlog History</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-slate-500">Standing Backlogs</span>
                        <span className={`text-xs font-black ${selectedStudent.academics.standingBacklogs > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {selectedStudent.academics.standingBacklogs}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-slate-500">Total History</span>
                        <span className="text-xs font-black text-slate-900">{selectedStudent.academics.backlogHistory}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Close
                </button>
                <button
                  className="flex-1 py-4 bg-purple-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-purple-700 transition-all shadow-lg shadow-purple-200"
                >
                  Download Transcript
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
