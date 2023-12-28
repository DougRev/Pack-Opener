import React, { useState } from 'react';
import './FileUpload.css';

function FileUpload() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCardUpload = async () => {
    await uploadFile('/api/cards/upload', 'Card data uploaded successfully');
  };

  const handleCardTemplateUpload = async () => {
    await uploadFile('/api/cardTemplate/upload', 'Card template data uploaded successfully');
  };

  const uploadFile = async (endpoint, successMessage) => {
    if (!file) {
      alert('Please select a file to upload');
      return;
    }
    const formData = new FormData();
    formData.append('file', file); // Make sure this matches the field name expected by Multer on the backend

    const token = localStorage.getItem('token'); // or however you store your token

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      if (response.ok) {
        try {
          const result = await response.json();
          alert(successMessage);
        } catch (jsonError) {
          // If response is not in JSON format, you can handle it here
          const textResult = await response.text();
          alert(textResult);
        }
      } else {
        try {
          const errorResult = await response.json();
          alert(errorResult.message);
        } catch (jsonError) {
          // If error response is not in JSON format
          alert('An error occurred, but the server did not return JSON.');
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleCardUpload}>Upload Card CSV</button>
      <button onClick={handleCardTemplateUpload}>Upload Card Template CSV</button>
    </div>
  );
}

export default FileUpload;
