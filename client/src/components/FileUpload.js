import React, { useState } from 'react';
import './FileUpload.css';

function FileUpload() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a file to upload');
      return;
    }
    const formData = new FormData();
    formData.append('csv', file);
  
    const token = localStorage.getItem('token'); // or however you store your token
  
    try {
      const response = await fetch('/api/cards/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // 'Content-Type': 'multipart/form-data', // This line should be removed
        },
        body: formData,
      });
      if (response.ok) {
        const result = await response.json();
        alert(result.message);
      } else {
        const errorResult = await response.json();
        alert(errorResult.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    }
  };
  
  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload CSV</button>
    </div>
  );
}

export default FileUpload;
