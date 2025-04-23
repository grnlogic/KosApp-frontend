import React, { useEffect, useState } from "react";
import {
  Home,
  User,
  LogOut,
  Camera,
  Edit,
  Save,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
} from "lucide-react";

export default function ProfilePage() {
  // User profile state
  const [profile, setProfile] = useState({
    name: "Budi Santoso",
    room: 2,
    phone: "+62 812-3456-7890",
    email: "budi.santoso@email.com",
    address: "Jl. Merdeka No. 123, Jakarta",
    joinDate: "1 Januari 2023",
    bio: "Mahasiswa Teknik Informatika di Universitas Indonesia. Suka membaca dan bermain gitar di waktu luang.",
  });

  //Profile pictur
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  //edit profile
  const [editBio, setEditBio] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [editingName, setEditingName] = useState(profile.name);
  const [editingEmail, setEditingEmail] = useState(profile.email);
  const [edingAddress, setEditingAddress] = useState(profile.address);
  const [editingPhone, setEditingPhone] = useState(profile.phone);
  const [tempBio, setTempBio] = useState(profile.bio);
  const [tempName, setTempName] = useState(profile.name);
  const [tempEmail, setTempEmail] = useState(profile.email);
  const [tempAddress, setTempAddress] = useState(profile.address);
  const [tempPhone, setTempPhone] = useState(profile.phone);

  // Saat login berhasil, simpan token ke localStorage
  // localStorage.setItem("authToken", token); // Removed or define 'token' before using
  //handle picture
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file); // Nama field harus sesuai dengan backend
      formData.append("roomId", profile.room.toString()); // Kirim roomId

      try {
        const res = await fetch(
          "http://localhost:8080/api/profile-picture/upload",
          {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Include token from localStorage
            },
          }
        );

        if (!res.ok) {
          if (res.status === 405) {
            console.error("Metode HTTP tidak didukung oleh server.");
          } else {
            throw new Error("Gagal mengunggah gambar");
          }
        }

        const data = await res.text();
        console.log("Gambar berhasil diunggah:", data);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  //trigger input click
  const triggerInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  //save bio
  const saveBio = () => {
    setProfile({
      ...profile,
      bio: tempBio,
    });
    setEditBio(false);
  };
  //cancel bio
  const cancelBio = () => {
    setTempBio(profile.bio);
    setEditBio(false);
  };
  //save name
  const saveName = () => {
    setProfile({
      ...profile,
      name: tempName,
    });
    setEditProfile(false);
  };
  //cancel name
  const cancelName = () => {
    setTempName(profile.name);
    setEditProfile(false);
  };
  //save email
  const saveEmail = () => {
    setProfile({
      ...profile,
      email: tempEmail,
    });
    setEditProfile(false);
  };
  //cancel email
  const cancelEmail = () => {
    setTempEmail(profile.email);
    setEditProfile(false);
  };
  //save address
  const saveAddress = () => {
    setProfile({
      ...profile,
      address: tempAddress,
    });
    setEditProfile(false);
  };
  //cancel address
  const cancelAddress = () => {
    setTempAddress(profile.address);
    setEditProfile(false);
  };
  //save phone
  const savePhone = () => {
    setProfile({
      ...profile,
      phone: tempPhone,
    });
    setEditProfile(false);
  };
  //cancel phone
  const cancelPhone = () => {
    setTempPhone(profile.phone);
    setEditProfile(false);
  };
  useEffect(() => {
    const fetchProfilePicture = async () => {
      const token = localStorage.getItem("authToken"); // Ambil token dari localStorage
      console.log("Token:", token); // Log token untuk memastikan token ada

      if (!token) {
        console.error("Token tidak ditemukan. Pastikan Anda sudah login.");
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:8080/api/profile-picture/${profile.room}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Kirim token di header
            },
          }
        );

        if (!res.ok) {
          throw new Error("Gagal memuat gambar profil");
        }

        const blob = await res.blob();
        const imageUrl = URL.createObjectURL(blob);
        setProfilePicture(imageUrl);
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };

    fetchProfilePicture();
  }, [profile.room]);

  console.log("roomId:", profile.room);

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF8E7]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#FFCC00] to-[#FF9500] p-5 flex justify-between items-center shadow-md">
        <h1 className="text-white text-xl font-bold">MiminKost</h1>
        <div className="flex gap-4">
          <Home
            className="text-white hover:text-[#FFF8E7] transition-colors cursor-pointer"
            size={24}
          />
          <User
            className="text-white hover:text-[#FFF8E7] transition-colors cursor-pointer"
            size={24}
          />
          <LogOut
            className="text-white hover:text-[#FFF8E7] transition-colors cursor-pointer"
            size={24}
          />
        </div>
      </header>

      {/* Profile Header */}
      <div className="bg-gradient-to-br from-[#FFCC00] to-[#FF9500] m-4 p-6 rounded-2xl shadow-lg relative">
        <div className="flex flex-col items-center">
          {/* Profile Picture */}
          <div className="relative mb-4">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-white border-4 border-white shadow-md">
              {profilePicture ? (
                <img
                  src={profilePicture || "/placeholder.svg"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <User size={50} className="text-gray-300" />
                </div>
              )}
            </div>
            <button
              onClick={triggerInputClick}
              className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <Camera size={18} className="text-[#FF7A00]" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              accept="image/*"
            />
          </div>

          {/* Name */}
          <div className="flex items-center gap-2 mb-1">
            {editProfile ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="bg-white rounded-lg px-3 py-2 text-gray-800 text-center shadow-inner focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                />
                <button
                  onClick={saveName}
                  className="text-white bg-[#FF7A00] hover:bg-[#FF9500] p-2 rounded-full transition-colors"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={cancelName}
                  className="text-white bg-gray-400 hover:bg-gray-500 p-2 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-white text-2xl font-bold">
                  {profile.name}
                </h2>
                <button
                  onClick={() => setEditProfile(true)}
                  className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
                >
                  <Edit size={16} />
                </button>
              </>
            )}
          </div>

          {/* Room Number */}
          <p className="text-white bg-white/20 px-3 py-1 rounded-full text-sm">
            Kamar {profile.room}
          </p>
        </div>
      </div>

      {/* Profile Content */}
      <div className="flex-1 px-4 pb-4">
        {/* Bio Section */}
        <div className="bg-white rounded-2xl shadow-md mb-4 overflow-hidden border border-[#FFCC00]/20">
          <div className="p-4 flex justify-between items-center bg-gradient-to-r from-[#FFCC00] to-[#FF9500]">
            <h3 className="font-medium text-white">Bio</h3>
            {!editBio && (
              <button
                onClick={() => setEditBio(true)}
                className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
              >
                <Edit size={16} />
              </button>
            )}
          </div>
          <div className="bg-white p-5">
            {editBio ? (
              <div className="space-y-3">
                <textarea
                  value={tempBio}
                  onChange={(e) => setTempBio(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
                  rows={4}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={saveBio}
                    className="bg-gradient-to-r from-[#FFCC00] to-[#FF9500] text-white px-4 py-2 rounded-lg flex items-center gap-1 hover:shadow-md transition-all"
                  >
                    <Save size={16} />
                    <span>Simpan</span>
                  </button>
                  <button
                    onClick={cancelBio}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-gray-200 transition-colors"
                  >
                    <X size={16} />
                    <span>Batal</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-md mb-4 overflow-hidden border border-[#FFCC00]/20">
          <div className="p-4 bg-gradient-to-r from-[#FFCC00] to-[#FF9500]">
            <h3 className="font-medium text-white mb-2">Informasi Kontak</h3>
          </div>
          <div className="bg-white p-5 space-y-5">
            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="bg-[#FFCC00]/10 p-3 rounded-full">
                <Phone size={20} className="text-[#FF7A00]" />
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-sm">Nomor Telepon</p>
                {editProfile ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={tempPhone}
                      onChange={(e) => setTempPhone(e.target.value)}
                      className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
                    />
                    <button
                      onClick={savePhone}
                      className="text-white bg-[#FF7A00] hover:bg-[#FF9500] p-2 rounded-full transition-colors"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      onClick={cancelPhone}
                      className="text-white bg-gray-400 hover:bg-gray-500 p-2 rounded-full transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-gray-700 font-medium">{profile.phone}</p>
                    <button
                      onClick={() => setEditProfile(true)}
                      className="text-gray-400 hover:text-[#FF7A00] transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="bg-[#FFCC00]/10 p-3 rounded-full">
                <Mail size={20} className="text-[#FF7A00]" />
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-sm">Email</p>
                {editProfile ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="email"
                      value={tempEmail}
                      onChange={(e) => setTempEmail(e.target.value)}
                      className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
                    />
                    <button
                      onClick={saveEmail}
                      className="text-white bg-[#FF7A00] hover:bg-[#FF9500] p-2 rounded-full transition-colors"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      onClick={cancelEmail}
                      className="text-white bg-gray-400 hover:bg-gray-500 p-2 rounded-full transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-gray-700 font-medium">{profile.email}</p>
                    <button
                      onClick={() => setEditProfile(true)}
                      className="text-gray-400 hover:text-[#FF7A00] transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="bg-[#FFCC00]/10 p-3 rounded-full">
                <MapPin size={20} className="text-[#FF7A00]" />
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-sm">Alamat</p>
                {editProfile ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={tempAddress}
                      onChange={(e) => setTempAddress(e.target.value)}
                      className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
                    />
                    <button
                      onClick={saveAddress}
                      className="text-white bg-[#FF7A00] hover:bg-[#FF9500] p-2 rounded-full transition-colors"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      onClick={cancelAddress}
                      className="text-white bg-gray-400 hover:bg-gray-500 p-2 rounded-full transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-gray-700 font-medium">
                      {profile.address}
                    </p>
                    <button
                      onClick={() => setEditProfile(true)}
                      className="text-gray-400 hover:text-[#FF7A00] transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Join Date */}
            <div className="flex items-start gap-4">
              <div className="bg-[#FFCC00]/10 p-3 rounded-full">
                <Calendar size={20} className="text-[#FF7A00]" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Tanggal Bergabung</p>
                <p className="text-gray-700 font-medium">{profile.joinDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
