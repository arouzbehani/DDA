import React from 'react';
import DocumentGalleryComponent from '../components/DocumentGallery/v2.0/DocumentGalleryComponent_V2';

const Documents: React.FC = () => {
    const baseApiUrl = 'http://localhost:5270/';
    const uploadApi = 'http://localhost:5270/api/document/add';
    const galleryApi = 'http://localhost:5270/api/document/gallery';
    return (
        <div>
            <h1>Welcome to the Dashboard</h1>
            {/* Other dashboard content here */}
            <DocumentGalleryComponent
                baseApiUrl={baseApiUrl}
                uploadApi={uploadApi}
                galleryApi={galleryApi}
                customCssClass=''

             /> {/* Add the logout button here */}
        </div>
    );
};

export default Documents;
