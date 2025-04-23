import React, { useState } from "react";
import BackButtonOrange from "../image/chevron-right.svg";

const Pengumuman: React.FC = () => {
    const [isContentVisible, setContentVisible] = useState(false);

    const toggleContent = () => {
        setContentVisible(!isContentVisible);
    };

    return (
        <div className="bg-[#FFA500] rounded-md p-5 mb-4">
            <h4 className="text-white font-bold text-2xl mb-4">PENGUMUMAN</h4>
            <div className="bg-white rounded-md p-5 max-w-md w-full mx-auto">
                <div className="flex items-center justify-between">
                    <h1 className="font-bold">Notifikasi</h1>
                    <img
                        src={BackButtonOrange}
                        alt="BackButton"
                        className={`w-10 h-10 cursor-pointer transition-transform duration-300 ${
                            isContentVisible ? "rotate-90" : ""
                        }`}
                        onClick={toggleContent}
                    />
                </div>
                {isContentVisible && (
                    <div className="mt-4">
                        <p>Ini adalah konten pengumuman yang dapat diperluas.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Pengumuman;