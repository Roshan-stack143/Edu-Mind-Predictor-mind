import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Dummy Data
  const students = [
    {
      id: '1',
      registerNumber: '732423243002',
      name: 'Arshiya Sana H',
      dob: '2002-05-14',
      academics: { internal1: 85, internal2: 88, previousCGPA: 8.5, standingBacklogs: 0, backlogHistory: 1, attendance: 92 },
      skills: [{ name: 'Python', level: 'Advanced', link: 'github.com/arshiya/py' }, { name: 'React', level: 'Intermediate', link: '' }],
      achievements: { technical: [{ name: 'Hackathon 2023', type: 'Hackathon', certificate: 'cert1.pdf' }], nonTechnical: [{ name: 'Debate Club', type: 'Cultural', certificate: 'cert2.pdf' }] },
      psychometric: { stressLevel: 30, motivationScore: 85, status: 'Psychologically Stable' },
      predictions: { academicSupport: 'Not Needed', riskLevel: 'Low Risk', recommendedDomain: 'Data Science', aiInsight: 'Student shows good technical ability and stable academic performance. Keep up the good work.' }
    },
    {
      id: '2',
      registerNumber: '732423243003',
      name: 'Darshankumar S',
      dob: '2002-05-14',
      academics: { internal1: 55, internal2: 60, previousCGPA: 6.2, standingBacklogs: 2, backlogHistory: 3, attendance: 75 },
      skills: [{ name: 'Java', level: 'Beginner', link: '' }],
      achievements: { technical: [], nonTechnical: [{ name: 'Football Team', type: 'Sports', certificate: 'cert3.pdf' }] },
      psychometric: { stressLevel: 80, motivationScore: 40, status: 'Needs Counseling' },
      predictions: { academicSupport: 'Needed', riskLevel: 'Academic & Psychological Risk', recommendedDomain: 'Software Testing', aiInsight: 'Student shows declining academic performance and high stress levels. Academic mentoring and counseling recommended.' }
    },
    {
      id: '3',
      registerNumber: '732423243005',
      name: 'Gayathri S',
      dob: '2002-05-14',
      academics: { internal1: 90, internal2: 92, previousCGPA: 9.1, standingBacklogs: 0, backlogHistory: 0, attendance: 98 },
      skills: [{ name: 'C++', level: 'Advanced', link: '' }, { name: 'Machine Learning', level: 'Intermediate', link: '' }],
      achievements: { technical: [{ name: 'Coding Contest', type: 'Competition', certificate: 'cert4.pdf' }], nonTechnical: [] },
      psychometric: { stressLevel: 40, motivationScore: 90, status: 'Psychologically Stable' },
      predictions: { academicSupport: 'Not Needed', riskLevel: 'Low Risk', recommendedDomain: 'Artificial Intelligence', aiInsight: 'Excellent academic record and high motivation. Encourage participation in advanced projects.' }
    },
    {
      id: '4',
      registerNumber: '732423243007',
      name: 'Habbeb Rahman M',
      dob: '2002-05-14',
      academics: { internal1: 70, internal2: 75, previousCGPA: 7.5, standingBacklogs: 0, backlogHistory: 1, attendance: 85 },
      skills: [{ name: 'JavaScript', level: 'Intermediate', link: '' }],
      achievements: { technical: [], nonTechnical: [{ name: 'Music Club', type: 'Cultural', certificate: 'cert5.pdf' }] },
      psychometric: { stressLevel: 50, motivationScore: 70, status: 'Mild Stress' },
      predictions: { academicSupport: 'Not Needed', riskLevel: 'Low Risk', recommendedDomain: 'Web Development', aiInsight: 'Steady performance. Could benefit from focusing on specific technical skills.' }
    },
    {
      id: '5',
      registerNumber: '732423243009',
      name: 'Hitesh Harwin B',
      dob: '2002-05-14',
      academics: { internal1: 65, internal2: 68, previousCGPA: 6.8, standingBacklogs: 1, backlogHistory: 2, attendance: 80 },
      skills: [{ name: 'HTML/CSS', level: 'Intermediate', link: '' }],
      achievements: { technical: [], nonTechnical: [] },
      psychometric: { stressLevel: 60, motivationScore: 60, status: 'Mild Stress' },
      predictions: { academicSupport: 'Needed', riskLevel: 'Academic Risk', recommendedDomain: 'UI/UX Design', aiInsight: 'Needs to clear standing backlogs. Additional academic support is recommended.' }
    },
    {
      id: '6',
      registerNumber: '732423243010',
      name: 'Immanuvel H',
      dob: '2002-05-14',
      academics: { internal1: 88, internal2: 85, previousCGPA: 8.2, standingBacklogs: 0, backlogHistory: 0, attendance: 95 },
      skills: [{ name: 'SQL', level: 'Advanced', link: '' }, { name: 'Database Management', level: 'Advanced', link: '' }],
      achievements: { technical: [{ name: 'Database Workshop', type: 'Workshop', certificate: 'cert6.pdf' }], nonTechnical: [] },
      psychometric: { stressLevel: 35, motivationScore: 80, status: 'Psychologically Stable' },
      predictions: { academicSupport: 'Not Needed', riskLevel: 'Low Risk', recommendedDomain: 'Data Engineering', aiInsight: 'Strong database skills. Good candidate for data engineering roles.' }
    },
    {
      id: '7',
      registerNumber: '732423243012',
      name: 'Jishnu R',
      dob: '2002-05-14',
      academics: { internal1: 75, internal2: 80, previousCGPA: 7.8, standingBacklogs: 0, backlogHistory: 0, attendance: 88 },
      skills: [{ name: 'Cloud Computing', level: 'Intermediate', link: '' }],
      achievements: { technical: [], nonTechnical: [{ name: 'Volunteering', type: 'Leadership', certificate: 'cert7.pdf' }] },
      psychometric: { stressLevel: 45, motivationScore: 75, status: 'Psychologically Stable' },
      predictions: { academicSupport: 'Not Needed', riskLevel: 'Low Risk', recommendedDomain: 'Cloud Architecture', aiInsight: 'Good overall performance. Leadership skills are a plus.' }
    },
    {
      id: '8',
      registerNumber: '732423243013',
      name: 'Kavin S',
      dob: '2002-05-14',
      academics: { internal1: 60, internal2: 65, previousCGPA: 6.5, standingBacklogs: 1, backlogHistory: 1, attendance: 78 },
      skills: [{ name: 'Networking', level: 'Beginner', link: '' }],
      achievements: { technical: [], nonTechnical: [] },
      psychometric: { stressLevel: 70, motivationScore: 50, status: 'Mild Stress' },
      predictions: { academicSupport: 'Needed', riskLevel: 'Academic Risk', recommendedDomain: 'System Administration', aiInsight: 'Needs to improve attendance and clear backlogs. Monitor stress levels.' }
    },
    {
      id: '9',
      registerNumber: '732423243020',
      name: 'Rithik Roshan G',
      dob: '2002-05-14',
      academics: { internal1: 82, internal2: 86, previousCGPA: 8.0, standingBacklogs: 0, backlogHistory: 0, attendance: 90 },
      skills: [{ name: 'Cybersecurity', level: 'Intermediate', link: '' }],
      achievements: { technical: [{ name: 'CTF Competition', type: 'Competition', certificate: 'cert8.pdf' }], nonTechnical: [] },
      psychometric: { stressLevel: 55, motivationScore: 85, status: 'Psychologically Stable' },
      predictions: { academicSupport: 'Not Needed', riskLevel: 'Low Risk', recommendedDomain: 'Cybersecurity', aiInsight: 'Good aptitude for security. Encourage further certifications.' }
    },
    {
      id: '10',
      registerNumber: '732423243025',
      name: 'Vijaykumar S',
      dob: '2002-05-14',
      academics: { internal1: 78, internal2: 82, previousCGPA: 7.9, standingBacklogs: 0, backlogHistory: 0, attendance: 86 },
      skills: [{ name: 'Mobile App Dev', level: 'Intermediate', link: '' }],
      achievements: { technical: [], nonTechnical: [{ name: 'Photography Club', type: 'Cultural', certificate: 'cert9.pdf' }] },
      psychometric: { stressLevel: 40, motivationScore: 78, status: 'Psychologically Stable' },
      predictions: { academicSupport: 'Not Needed', riskLevel: 'Low Risk', recommendedDomain: 'Mobile Development', aiInsight: 'Consistent performer with good creative skills.' }
    }
  ];

  // API Routes
  app.post('/api/auth/login', (req, res) => {
    const { registerNumber, dob, role } = req.body;
    if (role === 'faculty' && registerNumber === 'admin' && dob === 'admin') {
      return res.json({ success: true, role: 'faculty', user: { name: 'Faculty Admin' } });
    }
    
    if (role === 'student') {
      const student = students.find(s => s.registerNumber === registerNumber && s.dob === dob);
      if (student) {
        return res.json({ success: true, role: 'student', user: student });
      }
    }
    
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  });

  app.get('/api/students', (req, res) => {
    res.json(students);
  });

  app.get('/api/students/:id', (req, res) => {
    const student = students.find(s => s.id === req.params.id);
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  });

  app.post('/api/ai/predict', async (req, res) => {
    try {
      const { studentData } = req.body;
      let apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'undefined') {
        apiKey = process.env.API_KEY;
      }
      if (!apiKey || apiKey === 'undefined') {
        throw new Error('API key not found or invalid');
      }
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `Analyze the following student data and provide a JSON response with predictions.
      Student Data: ${JSON.stringify(studentData)}
      
      Provide a JSON object with the following structure:
      {
        "academicSupport": "Needed" | "Not Needed",
        "riskLevel": "Low Risk" | "Academic Risk" | "Psychological Risk" | "Academic & Psychological Risk",
        "recommendedDomain": "e.g., Data Science, Web Development, etc.",
        "aiInsight": "A short 2-sentence personalized recommendation."
      }`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const prediction = JSON.parse(response.text || '{}');
      res.json(prediction);
    } catch (error) {
      console.error('AI Prediction Error:', error);
      res.status(500).json({ error: 'Failed to generate prediction' });
    }
  });

  app.post('/api/ai/psychometric', async (req, res) => {
    try {
      const { answers, emotions } = req.body;
      let apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'undefined') {
        apiKey = process.env.API_KEY;
      }
      if (!apiKey || apiKey === 'undefined') {
        throw new Error('API key not found or invalid');
      }
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `Analyze the following psychometric test answers and the corresponding facial expressions detected for each question. Provide a JSON response with scores.
      Answers (1-5 scale, 1=Strongly Disagree, 5=Strongly Agree): ${JSON.stringify(answers)}
      Facial Expressions detected per question: ${JSON.stringify(emotions || [])}
      
      Provide a JSON object with the following structure:
      {
        "stressLevel": number (0-100),
        "motivationScore": number (0-100),
        "status": "Psychologically Stable" | "Mild Stress" | "Needs Counseling"
      }`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const result = JSON.parse(response.text || '{}');
      res.json(result);
    } catch (error) {
      console.error('AI Psychometric Error:', error);
      res.status(500).json({ error: 'Failed to analyze test' });
    }
  });

  app.post('/api/ai/facial-recognition', async (req, res) => {
    let apiKey = process.env.GEMINI_API_KEY;
    try {
      const { image } = req.body;
      if (!apiKey || apiKey === 'undefined') {
        apiKey = process.env.API_KEY;
      }
      if (!apiKey || apiKey === 'undefined') {
        throw new Error('API key not found or invalid');
      }
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `Analyze this image of a student's face. Determine their current emotional state and mental health condition based on their facial expression.
      Provide a JSON object with the following structure:
      {
        "expression": "e.g., Happy, Sad, Stressed, Neutral, Anxious",
        "confidence": number (0-100),
        "analysis": "A short 1-2 sentence analysis of their mental state based on the expression."
      }`;

      // Remove the data:image/jpeg;base64, part
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: 'image/jpeg'
              }
            },
            { text: prompt }
          ]
        },
        config: {
          responseMimeType: 'application/json',
        }
      });

      const result = JSON.parse(response.text || '{}');
      res.json(result);
    } catch (error) {
      console.error('AI Facial Recognition Error:', error);
      import('fs').then(fs => fs.writeFileSync('error.log', `API Key Length: ${apiKey?.length}\nAPI Key Starts With: ${apiKey?.substring(0, 5)}\n` + String(error) + '\n' + (error as any).stack));
      res.status(500).json({ error: 'Failed to analyze face' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
