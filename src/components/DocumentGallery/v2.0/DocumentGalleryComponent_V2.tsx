import React, { useState, useEffect } from 'react';
import axios from 'axios';
type DocumentUploadtProps = {
  baseApiUrl: string;
  uploadApi: string;
  galleryApi: string;
  customCssClass?: string;
};
interface DocumentDTO {
  name: string;
  description?: string;
  fileType: string;
  size: number;
  dateUploaded: string;
  url: string;
}

const DocumentGalleryComponent: React.FC <DocumentUploadtProps>= ({baseApiUrl,uploadApi,galleryApi,customCssClass}) => {
  const [documents, setDocuments] = useState<DocumentDTO[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const userAccessToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || '';

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Fetch documents from the server
  const fetchDocuments = async () => {
    try {
      
      const response = await axios.get(galleryApi, {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
      },

      });
      setDocuments(response.data);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents.');
    }
  };

  // Handle file selection
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Handle file upload
  const onUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {

      const response = await axios.post(uploadApi, formData, {
        params: { userAccessToken },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        },
      });

      if (response.status === 200) {
        // Fetch the updated document list after successful upload
        fetchDocuments();
        setSelectedFile(null);
        setUploadProgress(0);
      }
    } catch (err) {
      console.error('Error uploading document:', err);
      setError('Failed to upload document.');
    }
  };

  // Handle document download
  const onDownload = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div>
      <h2>Document Gallery</h2>
      {error && <p className="error">{error}</p>}

      {/* Document List */}
      <ul>
        {documents.map((doc) => (
          <li key={doc.url}>
            <p>{doc.name} ({doc.fileType}) - {doc.size} bytes</p>
            <button onClick={() => onDownload(doc.url)}>Download</button>
          </li>
        ))}
      </ul>

      {/* Upload Section */}
      <h3>Upload New Document</h3>
      <input type="file" onChange={onFileChange} />
      {uploadProgress > 0 && <p>Uploading: {uploadProgress}%</p>}
      <button onClick={onUpload} disabled={uploadProgress > 0 && uploadProgress < 100}>
        Upload
      </button>
    </div>
  );
};

export default DocumentGalleryComponent;
