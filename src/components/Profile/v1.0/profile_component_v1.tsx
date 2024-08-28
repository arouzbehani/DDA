import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profile_component_style_v1.css';

type UserData = {
    name: string;
    email: string;
    profilePictureUrl?: string;
};

type ProfileComponentProps = {
    updateApiUrl: string;
    initialDataUrl: string;
    customCssClass?: string;
    onUpdate: (updatedData: any) => void; // Update the type here

};

const ProfileComponent: React.FC<ProfileComponentProps> = ({ updateApiUrl, initialDataUrl, customCssClass }) => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhoneNumber] = useState('');
    const [profilePicUrl, setProfilePictureUrl] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Retrieve the token from localStorage
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken') ||'';

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!lastName) {
            setError("Last Name is required.");
            return;
        }

        try {
            const response = await axios.put(updateApiUrl, {
                firstName,
                lastName,
                phone,
                profilePicUrl,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setSuccessMessage("Profile updated successfully!");
            setUserData(response.data);
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
                    <label>Profile Picture URL</label>
                    <input
                        type="text"
                        value={profilePicUrl}
                        onChange={(e) => setProfilePictureUrl(e.target.value)}
                    />
                </div>
                <button type="submit">Update Profile</button>
                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
            </form>
        </div>
    );
};

export default ProfileComponent;
