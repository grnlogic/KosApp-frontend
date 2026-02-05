import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { roomService, Room } from "../../services/roomService";
import Navbar from "../../Navbar";
import { supabase } from "../../utils/supabaseClient";
import { User, Mail, Camera, Save, Edit, X } from "lucide-react";
import Commet from "../admin/Commet";

interface ProfileData {
  nama: string;
  email: string;
  bio: string;
  profileImage: string;
}

const RoomProfile: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    nama: "",
    email: "",
    bio: "",
    profileImage: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch room data
        if (roomId) {
          const roomData = await roomService.getRoomById(parseInt(roomId));
          setRoom(roomData);
        }

        // Fetch profile data from Supabase
        const userId = localStorage.getItem("userId");
        if (userId) {
          const { data, error: profileError } = await supabase
            .from("Profile")
            .select("*")
            .eq("userId", userId)
            .single();

          if (profileError) throw profileError;

          if (data) {
            setProfileData({
              nama: data.nama || "",
              email: data.email || "",
              bio: data.bio || "",
              profileImage: data.profileImage || "",
            });
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Gagal memuat data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [roomId]);

  // Check if user is not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleSave = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const { error } = await supabase
        .from("Profile")
        .update({
          nama: profileData.nama,
          email: profileData.email,
          bio: profileData.bio,
        })
        .eq("userId", userId);

      if (error) throw error;

      setIsEditing(false);
      alert("Profil berhasil diperbarui!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Gagal memperbarui profil");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("profiles")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("profiles")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("Profile")
        .update({ profileImage: urlData.publicUrl })
        .eq("userId", userId);

      if (updateError) throw updateError;

      setProfileData({ ...profileData, profileImage: urlData.publicUrl });
      alert("Foto profil berhasil diperbarui!");
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Gagal mengupload foto profil");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50">
        <Navbar setIsLoggedIn={setIsLoggedIn} roomId={roomId || ""} />
        <div className="flex items-center justify-center h-screen">
          <Commet
            color="#f59e0b"
            size="large"
            text="Memuat profil..."
            textColor="#92400e"
          />
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50">
        <Navbar setIsLoggedIn={setIsLoggedIn} roomId={roomId || ""} />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
            <p className="text-red-600 text-xl mb-4">
              {error || "Kamar tidak ditemukan"}
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-lg hover:from-yellow-500 hover:to-amber-600 font-semibold shadow-md transition-all"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50">
      <Navbar setIsLoggedIn={setIsLoggedIn} roomId={roomId || ""} />
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl shadow-xl p-8 mb-8 text-white">
            <button
              onClick={() => navigate(`/room/${roomId}`)}
              className="flex items-center text-white hover:text-yellow-100 mb-4 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Kembali
            </button>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                <User className="w-12 h-12" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Profil Penghuni</h1>
                <p className="text-yellow-50 text-lg">
                  Kelola informasi pribadi Anda
                </p>
              </div>
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Profile Header with Image */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 px-8 py-12 border-b border-yellow-100">
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <img
                    src={
                      profileData.profileImage ||
                      "https://via.placeholder.com/150"
                    }
                    alt="Profile"
                    className="w-40 h-40 rounded-full object-cover border-4 border-yellow-400 shadow-lg"
                  />
                  <label className="absolute bottom-2 right-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white p-3 rounded-full cursor-pointer hover:from-yellow-500 hover:to-amber-600 shadow-lg transition-all group-hover:scale-110">
                    <Camera className="w-5 h-5" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                <div className="mt-6 text-center">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {profileData.nama || "Nama Belum Diisi"}
                  </h2>
                  <p className="text-gray-600 mt-2 flex items-center justify-center gap-2">
                    <span className="bg-yellow-400 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Kamar {room.nomorKamar}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Informasi Pribadi
                </h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-4 py-2 rounded-lg hover:from-yellow-500 hover:to-amber-600 font-semibold shadow-md transition-all"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profil
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Nama Lengkap */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <User className="w-4 h-4 text-yellow-600" />
                    Nama Lengkap
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.nama}
                      onChange={(e) =>
                        setProfileData({ ...profileData, nama: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-lg"
                      placeholder="Masukkan nama lengkap Anda"
                    />
                  ) : (
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg px-4 py-3">
                      <p className="text-gray-800 text-lg">
                        {profileData.nama || "-"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Mail className="w-4 h-4 text-yellow-600" />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-lg"
                      placeholder="contoh@email.com"
                    />
                  ) : (
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg px-4 py-3">
                      <p className="text-gray-800 text-lg">
                        {profileData.email || "-"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Edit className="w-4 h-4 text-yellow-600" />
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData({ ...profileData, bio: e.target.value })
                      }
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none transition-all text-lg"
                      placeholder="Ceritakan sedikit tentang diri Anda..."
                    />
                  ) : (
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg px-4 py-3 min-h-[100px]">
                      <p className="text-gray-800 text-lg whitespace-pre-wrap">
                        {profileData.bio || "-"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleSave}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white py-3 px-6 rounded-lg hover:from-yellow-500 hover:to-amber-600 font-bold shadow-lg transition-all text-lg"
                    >
                      <Save className="w-5 h-5" />
                      Simpan Perubahan
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 font-bold shadow-lg transition-all text-lg"
                    >
                      <X className="w-5 h-5" />
                      Batal
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Room Info Card */}
          <div className="mt-8 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl shadow-xl p-6 text-white">
            <h3 className="font-bold text-xl mb-4">Informasi Kamar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <p className="text-sm text-yellow-50">Nomor Kamar</p>
                <p className="font-bold text-2xl mt-1">{room.nomorKamar}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <p className="text-sm text-yellow-50">Harga per Bulan</p>
                <p className="font-bold text-2xl mt-1">
                  Rp {room.hargaBulanan.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomProfile;
