import React, { useState } from "react";
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
    room: "Kamar 4",
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

  //handle picture
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
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

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF8E7]">
      {/* Header */}
      <header className="bg-[#FFCC00] p-5 flex justify-between items-center shadow-md">
        <h1 className="text-white text-2xl font-bold">MiminKost</h1>
        <div className="flex gap-5">
          <Home
            className="text-white hover:text-[#FF9900] transition-colors cursor-pointer"
            size={24}
          />
          <User
            className="text-white hover:text-[#FF9900] transition-colors cursor-pointer"
            size={24}
          />
          <LogOut
            className="text-white hover:text-[#FF9900] transition-colors cursor-pointer"
            size={24}
          />
        </div>
      </header>

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-[#FFCC00] to-[#FF9900] m-5 p-8 rounded-2xl shadow-lg relative">
        <div className="flex flex-col items-center">
          {/* Profile Picture */}
          <div className="relative mb-5">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-white border-4 border-white shadow-lg">
              {profilePicture ? (
                <img
                  src={profilePicture || "/placeholder.svg"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <User size={48} className="text-gray-400" />
                </div>
              )}
            </div>
            <button
              onClick={triggerInputClick}
              className="absolute bottom-0 right-0 bg-white p-2.5 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <Camera size={18} className="text-[#FF9900]" />
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
                  className="bg-white rounded-lg px-3 py-2 text-gray-800 text-center focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                />
                <button
                  onClick={saveName}
                  className="text-white hover:text-gray-100 transition-colors"
                >
                  <Save size={18} />
                </button>
                <button
                  onClick={cancelName}
                  className="text-white hover:text-gray-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-white text-2xl font-bold">
                  {profile.name}
                </h2>
                <button
                  onClick={() => setEditProfile(true)}
                  className="text-white hover:text-gray-100 transition-colors"
                >
                  <Edit size={18} />
                </button>
              </>
            )}
          </div>

          {/* Room Number */}
          <p className="text-white text-lg bg-[#FF9900] px-4 py-1 rounded-full shadow-md">
            {profile.room}
          </p>
        </div>
      </div>

      {/* Profile Content */}
      <div className="flex-1 px-5 pb-5">
        {/* Bio Section */}
        <div className="bg-white rounded-2xl shadow-lg mb-5 overflow-hidden border border-[#FFE180]">
          <div className="p-4 flex justify-between items-center bg-[#FFCC00]">
            <h3 className="font-medium text-white text-lg">Bio</h3>
            {!editBio && (
              <button
                onClick={() => setEditBio(true)}
                className="text-white hover:text-gray-100 transition-colors"
              >
                <Edit size={18} />
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
                    className="bg-gradient-to-r from-[#FFCC00] to-[#FF9900] text-white px-4 py-2 rounded-lg flex items-center gap-1 hover:opacity-90 transition-opacity shadow"
                  >
                    <Save size={16} />
                    <span>Simpan</span>
                  </button>
                  <button
                    onClick={cancelBio}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-gray-300 transition-colors"
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
        <div className="bg-white rounded-2xl shadow-lg mb-5 overflow-hidden border border-[#FFE180]">
          <div className="p-4 bg-[#FFCC00]">
            <h3 className="font-medium text-white text-lg mb-1">
              Informasi Kontak
            </h3>
          </div>
          <div className="bg-white p-5 space-y-5">
            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="bg-[#FFF8E7] p-2.5 rounded-full">
                <Phone size={20} className="text-[#FF9900]" />
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-sm">Nomor Telepon</p>
                {editProfile ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={tempPhone}
                      onChange={(e) => setTempPhone(e.target.value)}
                      className="flex-1 bg-gray-100 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
                    />
                    <button
                      onClick={savePhone}
                      className="text-[#FF9900] hover:text-[#FFCC00] transition-colors"
                    >
                      <Save size={18} />
                    </button>
                    <button
                      onClick={cancelPhone}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-gray-700 font-medium">{profile.phone}</p>
                    <button
                      onClick={() => setEditProfile(true)}
                      className="text-gray-400 hover:text-[#FF9900] transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="bg-[#FFF8E7] p-2.5 rounded-full">
                <Mail size={20} className="text-[#FF9900]" />
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-sm">Email</p>
                {editProfile ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="email"
                      value={tempEmail}
                      onChange={(e) => setTempEmail(e.target.value)}
                      className="flex-1 bg-gray-100 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
                    />
                    <button
                      onClick={saveEmail}
                      className="text-[#FF9900] hover:text-[#FFCC00] transition-colors"
                    >
                      <Save size={18} />
                    </button>
                    <button
                      onClick={cancelEmail}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-gray-700 font-medium">{profile.email}</p>
                    <button
                      onClick={() => setEditProfile(true)}
                      className="text-gray-400 hover:text-[#FF9900] transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="bg-[#FFF8E7] p-2.5 rounded-full">
                <MapPin size={20} className="text-[#FF9900]" />
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-sm">Alamat</p>
                {editProfile ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={tempAddress}
                      onChange={(e) => setTempAddress(e.target.value)}
                      className="flex-1 bg-gray-100 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
                    />
                    <button
                      onClick={saveAddress}
                      className="text-[#FF9900] hover:text-[#FFCC00] transition-colors"
                    >
                      <Save size={18} />
                    </button>
                    <button
                      onClick={cancelAddress}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-gray-700 font-medium">
                      {profile.address}
                    </p>
                    <button
                      onClick={() => setEditProfile(true)}
                      className="text-gray-400 hover:text-[#FF9900] transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Join Date */}
            <div className="flex items-start gap-4">
              <div className="bg-[#FFF8E7] p-2.5 rounded-full">
                <Calendar size={20} className="text-[#FF9900]" />
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
