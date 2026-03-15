import { useEffect, useState } from 'react';
import { Search, Filter, Trophy, Medal, Star, X, Calendar, ExternalLink, CheckCircle2, Download, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function StudentAchievements() {
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'Technical' | 'Non-Technical'>('Technical');

  useEffect(() => {
    fetch('/api/students')
      .then(res => res.json())
      .then(data => setStudents(data));
  }, []);

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.registerNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (achievement: any) => {
    if (achievement.fileData) {
      const link = document.createElement('a');
      link.href = achievement.fileData;
      link.download = achievement.fileName || 'certificate.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const dummyContent = `Certificate of Achievement\n\nAwarded for: ${achievement.name}\nType: ${achievement.type}\n\nThis is a generated document for dummy data.`;
      const blob = new Blob([dummyContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = achievement.certificate || 'certificate.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadFullReport = () => {
    if (!selectedStudent) return;
    
    let reportContent = `Achievement Report for ${selectedStudent.name} (${selectedStudent.registerNumber})\n`;
    reportContent += `====================================================================\n\n`;
    
    reportContent += `Technical Achievements:\n`;
    reportContent += `-----------------------\n`;
    if (selectedStudent.achievements?.technical?.length > 0) {
      selectedStudent.achievements.technical.forEach((ach: any, idx: number) => {
        reportContent += `${idx + 1}. ${ach.name} (${ach.type})\n`;
      });
    } else {
      reportContent += `None recorded.\n`;
    }
    
    reportContent += `\nNon-Technical Achievements:\n`;
    reportContent += `---------------------------\n`;
    if (selectedStudent.achievements?.nonTechnical?.length > 0) {
      selectedStudent.achievements.nonTechnical.forEach((ach: any, idx: number) => {
        reportContent += `${idx + 1}. ${ach.name} (${ach.type})\n`;
      });
    } else {
      reportContent += `None recorded.\n`;
    }
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedStudent.registerNumber}_achievement_report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
              <Trophy className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student <span className="text-purple-600">Excellence</span></h1>
          </div>
          <p className="text-slate-500 font-medium">Review and verify student achievements and extracurricular milestones.</p>
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
                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Technical</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Non-Technical</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredStudents.map((student, idx) => {
                  const techCount = student.achievements?.technical?.length || 0;
                  const nonTechCount = student.achievements?.nonTechnical?.length || 0;
                  
                  return (
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
                        <div className="flex items-center gap-2">
                          <Medal className="w-4 h-4 text-purple-500" />
                          <span className="text-sm font-black text-slate-700">{techCount} Awards</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-amber-500" />
                          <span className="text-sm font-black text-slate-700">{nonTechCount} Awards</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => setSelectedStudent(student)}
                          className="px-4 py-2 bg-purple-50 text-purple-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all"
                        >
                          Review
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Achievements Modal */}
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
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight">Achievement Portfolio</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedStudent.name}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedStudent(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-8">
                <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl mb-8 w-fit">
                  {(['Technical', 'Non-Technical'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        activeTab === tab 
                          ? 'bg-white text-purple-600 shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {(activeTab === 'Technical' ? selectedStudent.achievements?.technical : selectedStudent.achievements?.nonTechnical || [])
                    .map((achievement: any, idx: number) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={idx} 
                        className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:border-purple-200 transition-all group"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className={`p-3 rounded-2xl ${activeTab === 'Technical' ? 'bg-purple-50 text-purple-600' : 'bg-amber-50 text-amber-600'}`}>
                            {activeTab === 'Technical' ? <Medal className="w-6 h-6" /> : <Star className="w-6 h-6" />}
                          </div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {achievement.date || 'N/A'}
                          </span>
                        </div>
                        <h4 className="text-lg font-black text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">{achievement.name}</h4>
                        <p className="text-sm text-slate-500 font-medium mb-4 line-clamp-2">{achievement.type}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified
                          </span>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleDownload(achievement)}
                              className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                              title="Download Certificate"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all">
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  {(activeTab === 'Technical' ? selectedStudent.achievements?.technical : selectedStudent.achievements?.nonTechnical || []).length === 0 && (
                    <div className="col-span-2 py-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                      <p className="text-slate-400 font-medium">No {activeTab.toLowerCase()} achievements found.</p>
                    </div>
                  )}
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
                  onClick={handleDownloadFullReport}
                  className="flex-1 py-4 bg-purple-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Report
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
