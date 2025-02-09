import React, { useState, useEffect } from 'react';

function App() {
  useEffect(() => {
    chrome.storage.local.get('resume', (data) => {
      if (data.resume) {
        setStatus('Resume already uploaded and saved locally!');
      }
    });
  }, []);

  const [status, setStatus] = useState('');

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
      <p className='text-sm text-green-600'>{status}</p>
    </div>
  );
}

export default App;
