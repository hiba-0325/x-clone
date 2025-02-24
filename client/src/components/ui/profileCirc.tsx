"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../../utilities/axiosInstance";
import axiosErrorManager from "../../utilities/axiosErrorManager";
import { useRouter } from "next/navigation";

interface ProfileCircProps {
    username: string;
}

function ProfileCirc({ username }: ProfileCircProps): JSX.Element {
    const [profile, setProfile] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const fetchProfile = async (): Promise<void> => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/user/profile_pic/${username}`);
            setProfile(response.data.profile);
        } catch (error) {
            console.log(axiosErrorManager(error));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            className="w-8 h-8 overflow-hidden hover:cursor-pointer rounded-full"
            onClick={() => router.push(`/${username}`)}
        >
            {loading ? <span className="spinner" /> : <img src={profile} alt="Profile" />}
        </div>
    );
}

export default ProfileCirc;
