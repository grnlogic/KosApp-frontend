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
    room: "Kamar 1",
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
      <header className="bg-[#FF7A00] p-4 flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">MiminKost</h1>
        <div className="flex gap-4">
          <Home className="text-white" size={24} />
          <User className="text-white" size={24} />
          <LogOut className="text-white" size={24} />
        </div>
      </header>

      {/* Profile Header */}
      <div className="bg-[#FFCC00] m-4 p-6 rounded-xl shadow-md relative">
        <div className="flex flex-col items-center">
          {/* Profile Picture */}
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-white border-4 border-white">
              {profilePicture ? (
                <img
                  src={profilePicture || "/placeholder.svg"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <User size={40} className="text-gray-400" />
                </div>
              )}
            </div>
            <button
              onClick={triggerInputClick}
              className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md"
            >
              <Camera size={16} className="text-[#FF7A00]" />
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
                  className="bg-white rounded-md px-2 py-1 text-gray-800 text-center"
                />
                <button onClick={saveName} className="text-white">
                  <Save size={16} />
                </button>
                <button onClick={cancelName} className="text-white">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-white text-xl font-bold">{profile.name}</h2>
                <button
                  onClick={() => setEditProfile(true)}
                  className="text-white"
                >
                  <Edit size={16} />
                </button>
              </>
            )}
          </div>

          {/* Room Number */}
          <p className="text-white">{profile.room}</p>
        </div>
      </div>

      {/* Profile Content */}
      <div className="flex-1 px-4 pb-4">
        {/* Bio Section */}
        <div className="bg-[#FFCC00] rounded-xl shadow-md mb-4 overflow-hidden">
          <div className="p-4 flex justify-between items-center">
            <h3 className="font-medium text-white">Bio</h3>
            {!editBio && (
              <button onClick={() => setEditBio(true)} className="text-white">
                <Edit size={16} />
              </button>
            )}
          </div>
          <div className="bg-white p-4">
            {editBio ? (
              <div className="space-y-2">
                <textarea
                  value={tempBio}
                  onChange={(e) => setTempBio(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  rows={4}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={saveBio}
                    className="bg-[#FF7A00] text-white px-3 py-1 rounded-md flex items-center gap-1"
                  >
                    <Save size={16} />
                    <span>Simpan</span>
                  </button>
                  <button
                    onClick={cancelBio}
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md flex items-center gap-1"
                  >
                    <X size={16} />
                    <span>Batal</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700">{profile.bio}</p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-[#FFCC00] rounded-xl shadow-md mb-4 overflow-hidden">
          <div className="p-4">
            <h3 className="font-medium text-white mb-2">Informasi Kontak</h3>
          </div>
          <div className="bg-white p-4 space-y-4">
            {/* Phone */}
            <div className="flex items-start gap-3">
              <Phone size={20} className="text-[#FF7A00] mt-1" />
              <div className="flex-1">
                <p className="text-gray-500 text-sm">Nomor Telepon</p>
                {editProfile ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={tempPhone}
                      onChange={(e) => setTempPhone(e.target.value)}
                      className="flex-1 bg-gray-100 rounded-md px-2 py-1 text-gray-800"
                    />
                    <button onClick={savePhone} className="text-[#FF7A00]">
                      <Save size={16} />
                    </button>
                    <button onClick={cancelPhone} className="text-gray-500">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-gray-700">{profile.phone}</p>
                    <button
                      onClick={() => setEditProfile(true)}
                      className="text-gray-500"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <Mail size={20} className="text-[#FF7A00] mt-1" />
              <div className="flex-1">
                <p className="text-gray-500 text-sm">Email</p>
                {editProfile ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="email"
                      value={tempEmail}
                      onChange={(e) => setTempEmail(e.target.value)}
                      className="flex-1 bg-gray-100 rounded-md px-2 py-1 text-gray-800"
                    />
                    <button onClick={saveEmail} className="text-[#FF7A00]">
                      <Save size={16} />
                    </button>
                    <button onClick={cancelEmail} className="text-gray-500">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-gray-700">{profile.email}</p>
                    <button
                      onClick={() => setEditProfile(true)}
                      className="text-gray-500"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-[#FF7A00] mt-1" />
              <div className="flex-1">
                <p className="text-gray-500 text-sm">Alamat</p>
                {editProfile ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={tempAddress}
                      onChange={(e) => setTempAddress(e.target.value)}
                      className="flex-1 bg-gray-100 rounded-md px-2 py-1 text-gray-800"
                    />
                    <button onClick={saveAddress} className="text-[#FF7A00]">
                      <Save size={16} />
                    </button>
                    <button onClick={cancelAddress} className="text-gray-500">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-gray-700">{profile.address}</p>
                    <button
                      onClick={() => setEditProfile(true)}
                      className="text-gray-500"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Join Date */}
            <div className="flex items-start gap-3">
              <Calendar size={20} className="text-[#FF7A00] mt-1" />
              <div>
                <p className="text-gray-500 text-sm">Tanggal Bergabung</p>
                <p className="text-gray-700">{profile.joinDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
