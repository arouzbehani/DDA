import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './profile_component_style_v1.css';

type UserData = {
    name: string;
    email: string;
    phone: string;
    profilePictureUrl?: string;
};

type ProfileComponentProps = {
    baseApiUrl: string;
    updateApiUrl: string;
    initialDataUrl: string;
    imageUploadApiUrl: string; // New API endpoint for image upload
    customCssClass?: string;
    onUpdate: (updatedData: any) => void; // Update the type here
};

const ProfileComponent: React.FC<ProfileComponentProps> = ({updateApiUrl, initialDataUrl, customCssClass,baseApiUrl,imageUploadApiUrl }) => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhoneNumber] = useState('');
    const [profilePicUrl, setProfilePictureUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // New state for file upload
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [progress, setProgress] = useState<number>(0); // State for upload progress
    const [uploadProgress, setUploadProgress] = useState<number>(0); // Progress bar state

    // Retrieve the token from localStorage
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || '';
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(initialDataUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = response.data;
                setUserData(data);
                setFirstName(data.firstName || '');
                setLastName(data.lastName);
                setPhoneNumber(data.phone || '');
                setProfilePictureUrl(data.profilePicUrl || '');
            } catch (err) {
                setError("Failed to fetch user data.");
            }
        };

        fetchUserData();
    }, [token, initialDataUrl]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };
    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Trigger the file input click
        }
    };
    const handleImageUpload = async () => {
        if (!selectedFile) {
            setError("Please select an image to upload.");
            return;
            
        }

        setError(null);
        setUploadProgress(0); // Reset progress

        const formData = new FormData();
        formData.append('profilePic', selectedFile, selectedFile.name);

        try {
            const response = await axios.put(imageUploadApiUrl, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percentCompleted);
                    }
                },
            });

            setProfilePictureUrl(response.data.profilePicUrl); // Assuming the server returns the updated URL
            setSuccessMessage("Profile picture updated successfully!");
            setSelectedFile(null);
        } catch (err) {
            setError("Failed to upload the profile picture.");
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!lastName) {
            setError("Last Name is required.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            formData.append('phone', phone);

            if (selectedFile) {
                formData.append('profilePic', selectedFile, selectedFile.name);
            } else {
                formData.append('profilePicUrl', profilePicUrl);
            }

            const response = await axios.put(updateApiUrl, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setProgress(percentCompleted);
                    } else if (selectedFile) {
                        // Fallback if progressEvent.total is not available
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / selectedFile.size);
                        setProgress(percentCompleted);
                    }
                },

            });

            // Update the profile image URL after a successful upload
            const updatedUserData = response.data;
            setProfilePictureUrl(updatedUserData.profilePicUrl); // Assuming this is returned from the server

            setSuccessMessage("Profile updated successfully!");
            setUserData(updatedUserData);
            setProgress(0); // Reset progress

        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "An error occurred while updating the profile.");
            } else {
                setError("An unknown error occurred.");
            }
        }
    };

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className={`profile-component ${customCssClass}`}>
            <form onSubmit={handleSubmit}>
                <div className="profile-picture">
                <img src={profilePicUrl || 'default-profile.png'} alt="Profile" />
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    <button type="button" onClick={handleImageUpload}>
                        Upload Profile Picture
                    </button>
                    {uploadProgress > 0 && (
                        <div className="progress-bar">
                            <div className="progress" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                    )}
                </div>
                <div className="form-group">
                    <label>First Name</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={error && !firstName ? 'error' : ''}
                    />
                    {error && !firstName && <span className="error-message">First Name is required.</span>}
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className={error && !lastName ? 'error' : ''}
                    />
                    {error && !lastName && <span className="error-message">Last Name is required.</span>}
                </div>
                <div className="form-group">
                    <label>Phone</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>
                {/* <div className="form-group">
                    <label>Profile Picture URL</label>
                    <input
                        type="text"
                        value={profilePicUrl}
                        onChange={(e) => setProfilePictureUrl(e.target.value)}
                    // disabled={!!selectedFile} // Disable if file is selected
                    />
                </div> */}
                {/* <div className="form-group">
                    <label>Upload Profile Picture</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </div> */}
                {/* Progress Bar */}
                {progress > 0 && (
                    <div className="progress-bar">
                        <div className="progress" style={{ width: `${progress}%` }}>
                            {progress}%
                        </div>
                    </div>
                )}
                <button type="submit">Update Profile</button>
                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
            </form>
        </div>
    );
};

export default ProfileComponent;
