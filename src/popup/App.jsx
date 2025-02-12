import React, { useState, useEffect } from 'react';

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

function extractKeyInfo(resumeText) {
  const skillsRegex = /Skills:\s*(.+)/i;
  const experienceRegex = /Experience:\s*(.+)/i;

  const skills = (resumeText.match(skillsRegex) || [])[1] || 'N/A';
  const experience = (resumeText.match(experienceRegex) || [])[1] || 'N/A';

  return {
    skills: skills.trim(),
    experience: experience.trim(),
  };
}

function App() {
  const [status, setStatus] = useState('');
  const [summary, setSummary] = useState('');

  useEffect(() => {
    chrome.storage.local.get('resume', (data) => {
      if (data.resume) {
        setStatus('Resume already uploaded and saved locally!');
      }
    });

    chrome.storage.local.get('summary', (data) => {
      if (data.summary) {
        setSummary(data.summary);
      }
    });
  }, [summary]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = () => {
        // Store the file content in chrome.storage
        chrome.storage.local.set({ resume: reader.result }, () => {
          setStatus('Resume uploaded and saved locally!');
        });
      };
      reader.readAsDataURL(file); // Convert the PDF to base64
    } else {
      setStatus('Please upload a valid PDF file.');
    }
  };

  const getSummary = () => {
    console.log('Getting summary...');
    chrome.storage.local.get('resume', async (data) => {
      if (data.resume) {
        const resumeBase64 = data.resume.split(',')[1];
        const resumeText = atob(resumeBase64);

        console.log(resumeText);

        const { skills, experience } = extractKeyInfo(resumeText);

        // const completion = await openai.chat.completions.create({
        //   messages: [
        //     {
        //       role: 'system',
        //       content: 'Summarize the key skills and experience in the resume',
        //     },
        //     {
        //       role: 'user',
        //       content: `Resume: ${resumeText}`,
        //     },
        //   ],
        //   model: 'gpt-4',
        // });

        // const summary = completion.choices[0].message.content.trim();
        const summary = `Skills: ${skills}\nExperience: ${experience}`;
        setSummary(summary);

        chrome.storage.local.set({ summary });
      } else {
        setStatus('Please upload a resume first.');
      }
    });
  };

  return (
    <div className='p-4 text-center bg-gray-100 rounded-md shadow-md'>
      <h1 className='text-xl font-bold text-blue-700'>LinkedIn Rephraser</h1>
      <p className='text-gray-600 mb-4'>Upload your resume (PDF):</p>

      <input
        type='file'
        accept='application/pdf'
        onChange={handleFileUpload}
        className='mb-2'
      />

      <h2 className='text-lg font-bold text-blue-700'>Status</h2>
      <p className='text-sm text-green-600'>{status}</p>

      <button
        className='bg-blue-700 text-white px-4 py-2 mt-4 rounded-md'
        disabled={!status}
        onClick={getSummary}>
        Get Summary
      </button>

      <p className='text-sm text-green-600'>{summary}</p>
    </div>
  );
}

export default App;
