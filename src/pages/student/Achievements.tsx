import React, { useEffect, useState } from 'react';
import { FileText, Upload, Plus, Award, Download, X, Trophy, Target, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Achievements() {
  const [student, setStudent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'technical' | 'nonTechnical'>('technical');
  const [isAdding, setIsAdding] = useState(false);
  const [newAchievement, setNewAchievement] = useState({ name: '', type: '', certificate: '', fileData: '' });

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAchievement({
          ...newAchievement,
          certificate: file.name,
          fileData: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedStudent = { ...student };
    if (activeTab === 'technical') {
      updatedStudent.achievements.technical.push(newAchievement);
    } else {
      updatedStudent.achievements.nonTechnical.push(newAchievement);
    }
    setStudent(updatedStudent);
    setIsAdding(false);
    setNewAchievement({ name: '', type: '', certificate: '', fileData: '' });
  };

  const handleDownload = (achievement: any) => {
    if (achievement.fileData) {
      const a = document.createElement('a');
      a.href = achievement.fileData;
      a.download = achievement.certificate;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const blob = new Blob(['Dummy certificate content for ' + achievement.certificate], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = achievement.certificate || 'certificate.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const technicalTypes = ['Hackathon', 'Workshop', 'Competition', 'Certification'];
  const nonTechnicalTypes = ['Sports', 'Cultural', 'Leadership', 'Social Service'];

  const currentAchievements = activeTab === 'technical' ? student.achievements.technical : student.achievements.nonTechnical;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your <span className="text-blue-600">Achievements</span></h1>
          <p className="text-slate-500 font-medium mt-1">A timeline of your milestones and accolades.</p>
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
          Add Milestone
        </motion.button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="border-b border-white/20 bg-white/30 p-2">
          <nav className="flex gap-2">
            <button
              onClick={() => setActiveTab('technical')}
              className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                activeTab === 'technical'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'text-slate-500 hover:bg-white/50'
              }`}
            >
              Technical
            </button>
            <button
              onClick={() => setActiveTab('nonTechnical')}
              className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                activeTab === 'nonTechnical'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'text-slate-500 hover:bg-white/50'
              }`}
            >
              Non-Technical
            </button>
          </nav>
        </div>

        <AnimatePresence mode="wait">
          {isAdding && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-8 bg-blue-50/30 border-b border-white/20"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  New {activeTab === 'technical' ? 'Technical' : 'Non-Technical'} Record
                </h3>
                <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleAddAchievement} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Event / Achievement Name</label>
                    <input
                      type="text"
                      required
                      value={newAchievement.name}
                      onChange={e => setNewAchievement({ ...newAchievement, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 transition-all"
                      placeholder="e.g., Global Hackathon 2024"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                    <select
                      required
                      value={newAchievement.type}
                      onChange={e => setNewAchievement({ ...newAchievement, type: e.target.value })}
                      className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 transition-all appearance-none"
                    >
                      <option value="" disabled>Select Category</option>
                      {(activeTab === 'technical' ? technicalTypes : nonTechnicalTypes).map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Certificate Upload</label>
                    <div className="relative group">
                      <input 
                        id="file-upload" 
                        type="file" 
                        className="sr-only" 
                        onChange={handleFileUpload} 
                      />
                      <label 
                        htmlFor="file-upload" 
                        className="w-full px-4 py-3 bg-white/50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-3 cursor-pointer group-hover:border-blue-400 group-hover:bg-blue-50/50 transition-all"
                      >
                        <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                        <span className="font-bold text-slate-500 group-hover:text-blue-600 truncate max-w-[150px]">
                          {newAchievement.certificate || 'Choose File'}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-6 py-3 font-black text-sm text-slate-500 uppercase tracking-wider hover:text-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                  >
                    Save Record
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8"
        >
          {currentAchievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentAchievements.map((achievement: any, index: number) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/40 border border-white/40 rounded-3xl p-6 hover:shadow-xl hover:shadow-blue-100/50 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 group-hover:bg-blue-100 transition-colors" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        {activeTab === 'technical' ? <Target className="w-5 h-5" /> : <Trophy className="w-5 h-5" />}
                      </div>
                    </div>
                    <h4 className="text-lg font-black text-slate-800 leading-tight mb-2">{achievement.name}</h4>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-wider border border-blue-100">
                      {achievement.type}
                    </span>
                    
                    <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center text-xs font-bold text-slate-400 truncate mr-2">
                        <FileText className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                        <span className="truncate max-w-[100px]">{achievement.certificate}</span>
                      </div>
                      <button 
                        onClick={() => handleDownload(achievement)}
                        className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 uppercase tracking-wider hover:text-blue-800 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Get File
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-black text-slate-800">No Achievements Yet</h3>
              <p className="text-slate-500 font-medium mt-2 max-w-xs mx-auto">Start documenting your journey by adding your first milestone.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
