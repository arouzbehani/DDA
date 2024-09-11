import React from 'react';
import ProfileComponent from '../components/Profile/v1.0/profile_component_v1';

const Profile: React.FC = () => {
    const baseApiUrl = 'http://localhost:5270/';
    const initialDataUrl = 'http://localhost:5270/api/user/profile';
    const apiUrl = 'http://localhost:5270/api/user/update';
    const imageApiUrl = 'http://localhost:5270/api/user/updateImage';

    const handleProfileUpdate = (updatedData: any) => {
        console.log('Profile updated:', updatedData);
    };

    return (
        <div className="profile-page">
            <h1>User Profile</h1>
            <ProfileComponent 
                baseApiUrl={baseApiUrl}
                initialDataUrl={initialDataUrl}
                updateApiUrl={apiUrl}
                imageUploadApiUrl={imageApiUrl}
                customCssClass="custom-profile"
                onUpdate={handleProfileUpdate}
            />
        </div>
    );
};

export default Profile;
