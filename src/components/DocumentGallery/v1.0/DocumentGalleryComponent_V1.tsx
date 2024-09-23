import React, { useState } from 'react';
import axios from 'axios';
type DocumentUploadtProps = {
    baseApiUrl: string;
    uploadApi: string;
    customCssClass?: string;
};
const DocumentGalleryComponent: React.FC<DocumentUploadtProps> = ({baseApiUrl,uploadApi,customCssClass}) => {
    const [documentName, setDocumentName] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || '';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            alert("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append('name', documentName);
        formData.append('description', description);
        formData.append('file', file);

        try {
            const response = await axios.post(`${baseApiUrl}/${uploadApi}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Add token
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress);
                    }
                }
            });

            // Add to document list and reset the form
            alert('Document uploaded successfully');
            setDocumentName('');
            setDescription('');
            setFile(null);
            setUploadProgress(null);

        } catch (error) {
            console.error('Error uploading document', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    placeholder="Document Name"
                    required
                />
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                />
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    required
                />
                <button type="submit">Upload Document</button>
            </form>
            {uploadProgress !== null && (
                <div>
                    <progress value={uploadProgress} max="100"></progress>
                    <span>{uploadProgress}%</span>
                </div>
            )}
        </div>
    );
};

export default DocumentGalleryComponent;
