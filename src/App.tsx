/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import StudentLayout from './layouts/StudentLayout';
import FacultyLayout from './layouts/FacultyLayout';
import StudentDashboard from './pages/student/Dashboard';
import Academics from './pages/student/Academics';
import Skills from './pages/student/Skills';
import Achievements from './pages/student/Achievements';
import PsychometricTest from './pages/student/PsychometricTest';
import FacultyDashboard from './pages/faculty/Dashboard';
import StudentAcademics from './pages/faculty/StudentAcademics';
import StudentPsychometric from './pages/faculty/StudentPsychometric';
import StudentSkills from './pages/faculty/StudentSkills';
import StudentAchievements from './pages/faculty/StudentAchievements';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        {/* Student Routes */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="academics" element={<Academics />} />
          <Route path="skills" element={<Skills />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="psychometric" element={<PsychometricTest />} />
        </Route>

        {/* Faculty Routes */}
        <Route path="/faculty" element={<FacultyLayout />}>
          <Route index element={<Navigate to="/faculty/dashboard" replace />} />
          <Route path="dashboard" element={<FacultyDashboard />} />
          <Route path="academics" element={<StudentAcademics />} />
          <Route path="psychometric" element={<StudentPsychometric />} />
          <Route path="skills" element={<StudentSkills />} />
          <Route path="achievements" element={<StudentAchievements />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
