import React, { useState, useRef, useEffect } from 'react';
import { Brain, CheckCircle2, AlertCircle, Camera, Play, RefreshCcw, Sparkles, Activity, Heart, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const questions = [
  "I feel stressed about my academic workload.",
  "I feel motivated to attend my classes regularly.",
  "I feel comfortable asking teachers for help when I don't understand something.",
  "I find it difficult to concentrate on my studies.",
  "I feel overwhelmed by the expectations placed on me.",
  "I have a good balance between my studies and personal life.",
  "I feel anxious before exams or presentations.",
  "I feel supported by my peers and friends.",
  "I often feel exhausted or burnt out.",
  "I feel confident about my future career prospects."
];

const options = [
  { label: 'Strongly Disagree', value: 1 },
  { label: 'Disagree', value: 2 },
  { label: 'Neutral', value: 3 },
  { label: 'Agree', value: 4 },
  { label: 'Strongly Agree', value: 5 }
];

export default function PsychometricTest() {
  const [testStarted, setTestStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [answers, setAnswers] = useState<number[]>(Array(10).fill(0));
  const [questionEmotions, setQuestionEmotions] = useState<string[]>(Array(10).fill(''));
  const [isAnalyzingQuestion, setIsAnalyzingQuestion] = useState<boolean[]>(Array(10).fill(false));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (!result && testStarted) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [result, testStarted]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const captureAndAnalyzeFaceForQuestion = async (questionIndex: number) => {
    if (videoRef.current && canvasRef.current) {
      setIsAnalyzingQuestion(prev => {
        const next = [...prev];
        next[questionIndex] = true;
        return next;
      });

      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 320, 240);
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        
        try {
          const res = await fetch('/api/ai/facial-recognition', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: imageData }),
          });
          const data = await res.json();
          
          setQuestionEmotions(prev => {
            const next = [...prev];
            next[questionIndex] = data.expression;
            return next;
          });
        } catch (error) {
          console.error("Failed to analyze face", error);
        } finally {
          setIsAnalyzingQuestion(prev => {
            const next = [...prev];
            next[questionIndex] = false;
            return next;
          });
        }
      }
    }
  };

  const handleOptionChange = (questionIndex: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);
    captureAndAnalyzeFaceForQuestion(questionIndex);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (answers.includes(0)) {
      alert("Please answer all questions");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/ai/psychometric', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, emotions: questionEmotions }),
      });
      const data = await res.json();
      setResult(data);
      stopCamera();
    } catch (error) {
      console.error("Failed to submit test", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-100 mb-6 shadow-lg shadow-blue-100">
            <Brain className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Analysis <span className="text-blue-600">Complete</span></h1>
          <p className="mt-2 text-slate-500 font-medium">Your cognitive and emotional profile has been generated.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card overflow-hidden"
        >
          <div className={`p-8 border-b ${
            result.status === 'Psychologically Stable' ? 'bg-emerald-50/50 border-emerald-100' :
            result.status === 'Mild Stress' ? 'bg-amber-50/50 border-amber-100' :
            'bg-red-50/50 border-red-100'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Overall Assessment</p>
                <h2 className={`text-3xl font-black ${
                  result.status === 'Psychologically Stable' ? 'text-emerald-700' :
                  result.status === 'Mild Stress' ? 'text-amber-700' :
                  'text-red-700'
                }`}>{result.status}</h2>
              </div>
              <div className={`p-4 rounded-2xl ${
                result.status === 'Psychologically Stable' ? 'bg-emerald-100 text-emerald-600' :
                result.status === 'Mild Stress' ? 'bg-amber-100 text-amber-600' :
                'bg-red-100 text-red-600'
              }`}>
                {result.status === 'Psychologically Stable' ? (
                  <CheckCircle2 className="w-10 h-10" />
                ) : (
                  <AlertCircle className="w-10 h-10" />
                )}
              </div>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stress Level</p>
                <span className="text-2xl font-black text-slate-900">{result.stressLevel}<span className="text-sm text-slate-400">/100</span></span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${result.stressLevel}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-full ${
                    result.stressLevel < 40 ? 'bg-emerald-500' :
                    result.stressLevel < 70 ? 'bg-amber-500' :
                    'bg-red-500'
                  }`} 
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Motivation Score</p>
                <span className="text-2xl font-black text-slate-900">{result.motivationScore}<span className="text-sm text-slate-400">/100</span></span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${result.motivationScore}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-full ${
                    result.motivationScore > 70 ? 'bg-emerald-500' :
                    result.motivationScore > 40 ? 'bg-amber-500' :
                    'bg-red-500'
                  }`} 
                />
              </div>
            </div>
          </div>

          <div className="p-8 bg-blue-50/30 border-t border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-black text-slate-800">AI Insight</h3>
            </div>
            <p className="text-slate-600 font-medium leading-relaxed">
              {result.status === 'Needs Counseling' 
                ? "Your results indicate high levels of stress and low motivation. We strongly recommend scheduling a session with the campus counselor to discuss your well-being."
                : result.status === 'Mild Stress'
                ? "You are experiencing some stress. Consider taking breaks, managing your time effectively, and reaching out to peers or mentors if you feel overwhelmed."
                : "You are currently in a good psychological state. Keep up your healthy habits and maintain a good work-life balance."}
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <button
            onClick={() => {
              setResult(null);
              setAnswers(Array(10).fill(0));
              setQuestionEmotions(Array(10).fill(''));
              setTestStarted(false);
            }}
            className="inline-flex items-center gap-2 text-blue-600 font-black text-sm uppercase tracking-widest hover:text-blue-800 transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            Retake Evaluation
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 relative">
      <AnimatePresence>
        {!testStarted ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center space-y-8 py-12"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-blue-100 mb-4 shadow-xl shadow-blue-100">
              <Brain className="w-12 h-12 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Psychometric <span className="text-blue-600">Evaluation</span></h1>
              <p className="mt-4 text-slate-500 font-medium max-w-2xl mx-auto text-lg">
                This AI-powered assessment analyzes your responses and facial micro-expressions to provide a comprehensive wellness profile.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                { icon: Camera, title: "Facial Analysis", desc: "Real-time expression tracking" },
                { icon: Activity, title: "Stress Metrics", desc: "Cognitive load detection" },
                { icon: Shield, title: "Private & Secure", desc: "Encrypted data processing" }
              ].map((item, i) => (
                <div key={i} className="glass-card p-6 text-center">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-slate-800 text-sm uppercase tracking-wider mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setTestStarted(true)}
              className="inline-flex items-center px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-xl uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 hover:scale-105 active:scale-95"
            >
              <Play className="w-6 h-6 mr-3" />
              Begin Assessment
            </button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            <div className="fixed bottom-8 right-8 w-64 h-48 bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white z-50 group">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <canvas ref={canvasRef} width="320" height="240" className="hidden" />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg">Live Analysis</span>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-white/20 bg-white/30 flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-800">Assessment Questionnaire</h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                    {answers.filter(a => a !== 0).length} / 10 Complete
                  </span>
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="divide-y divide-slate-100">
                  {questions.map((question, index) => (
                    <div key={index} className="p-8 hover:bg-blue-50/30 transition-colors">
                      <div className="flex justify-between items-start gap-6 mb-6">
                        <p className="text-lg font-bold text-slate-800 leading-tight">
                          <span className="text-blue-600 mr-3 font-black opacity-50">{String(index + 1).padStart(2, '0')}</span>
                          {question}
                        </p>
                        <AnimatePresence mode="wait">
                          {isAnalyzingQuestion[index] ? (
                            <motion.span 
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className="flex-shrink-0 text-[10px] font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest animate-pulse"
                            >
                              Analyzing...
                            </motion.span>
                          ) : questionEmotions[index] ? (
                            <motion.span 
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex-shrink-0 text-[10px] font-black text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest"
                            >
                              {questionEmotions[index]}
                            </motion.span>
                          ) : null}
                        </AnimatePresence>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                        {options.map((option) => (
                          <label
                            key={option.value}
                            className={`relative flex flex-col items-center p-4 cursor-pointer rounded-2xl border-2 transition-all ${
                              answers[index] === option.value
                                ? 'border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-100'
                                : 'border-slate-100 hover:border-blue-200 hover:bg-white'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${index}`}
                              value={option.value}
                              checked={answers[index] === option.value}
                              onChange={() => handleOptionChange(index, option.value)}
                              className="sr-only"
                            />
                            <span className={`text-[10px] font-black text-center uppercase tracking-widest ${
                              answers[index] === option.value ? 'text-blue-700' : 'text-slate-400'
                            }`}>
                              {option.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div 
                        animate={{ width: `${(answers.filter(a => a !== 0).length / 10) * 100}%` }}
                        className="h-full bg-blue-600"
                      />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || answers.includes(0)}
                    className={`px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all shadow-xl ${
                      isSubmitting || answers.includes(0)
                        ? 'bg-slate-300 cursor-not-allowed shadow-none'
                        : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                    }`}
                  >
                    {isSubmitting ? 'Processing Profile...' : 'Finalize Assessment'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
