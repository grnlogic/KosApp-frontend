import React, { useState, useRef } from "react";
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
  Check,
} from "lucide-react";
import { uploadImage, fetchProfileImage } from "../../utils/imageUpload";
import Swal from "sweetalert2";
import AvatarEditor from "react-avatar-editor";

export default function ProfilePage() {
  // User profile state
  const [profile, setProfile] = useState({
    name: "Budi Santoso",
    room: "Kamar 3",
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

  // Image cropping state
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const editorRef = useRef<AvatarEditor | null>(null);

  //handle picture
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Show image editor instead of uploading directly
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToEdit(reader.result as string);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle saving cropped image
  const handleSaveCroppedImage = async () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      const croppedImageUrl = canvas.toDataURL();

      // Set temporary preview
      setProfilePicture(croppedImageUrl);

      // Close modal
      setShowCropModal(false);

      // Convert canvas to blob and upload
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            const roomId = profile.room.replace("Kamar ", "");
            Swal.fire({
              title: "Mengunggah gambar...",
              didOpen: () => {
                Swal.showLoading();
              },
              allowOutsideClick: false,
              allowEscapeKey: false,
            });

            const imageUrl = await uploadImage(
              new File([blob], "profile-image.png", { type: "image/png" }),
              roomId
            );

            console.log("Received image URL from Supabase:", imageUrl);

            if (imageUrl) {
              // Force browser to reload the image by adding a timestamp
              const cachedImageUrl = `${imageUrl}?t=${new Date().getTime()}`;
              setProfilePicture(cachedImageUrl);

              Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Foto profil berhasil diperbarui.",
                timer: 1500,
                showConfirmButton: false,
              });
            }
          } catch (error) {
            console.error("Error uploading image to Supabase:", error);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Gagal mengunggah gambar. Silakan coba lagi.",
            });
          }
        }
      }, "image/png");
    }
  };

  // Add missing triggerInputClick function
  const triggerInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Update save functions with SweetAlert
  const saveBio = () => {
    Swal.fire({
      title: "Simpan perubahan bio?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#FFCC00",
      cancelButtonColor: "#d33",
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setProfile({
          ...profile,
          bio: tempBio,
        });
        setEditBio(false);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Bio berhasil diperbarui!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  //save name
  const saveName = () => {
    Swal.fire({
      title: "Simpan perubahan nama?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#FFCC00",
      cancelButtonColor: "#d33",
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setProfile({
          ...profile,
          name: tempName,
        });
        setEditProfile(false);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Nama berhasil diperbarui!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  //save email
  const saveEmail = () => {
    Swal.fire({
      title: "Simpan perubahan email?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#FFCC00",
      cancelButtonColor: "#d33",
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setProfile({
          ...profile,
          email: tempEmail,
        });
        setEditProfile(false);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Email berhasil diperbarui!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  //save address
  const saveAddress = () => {
    Swal.fire({
      title: "Simpan perubahan alamat?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#FFCC00",
      cancelButtonColor: "#d33",
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setProfile({
          ...profile,
          address: tempAddress,
        });
        setEditProfile(false);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Alamat berhasil diperbarui!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  //save phone
  const savePhone = () => {
    Swal.fire({
      title: "Simpan perubahan nomor telepon?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#FFCC00",
      cancelButtonColor: "#d33",
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setProfile({
          ...profile,
          phone: tempPhone,
        });
        setEditProfile(false);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Nomor telepon berhasil diperbarui!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  //cancel bio
  const cancelBio = () => {
    setTempBio(profile.bio);
    setEditBio(false);
  };

  //cancel name
  const cancelName = () => {
    setTempName(profile.name);
    setEditProfile(false);
  };

  //cancel email
  const cancelEmail = () => {
    setTempEmail(profile.email);
    setEditProfile(false);
  };

  //cancel address
  const cancelAddress = () => {
    setTempAddress(profile.address);
    setEditProfile(false);
  };

  //cancel phone
  const cancelPhone = () => {
    setTempPhone(profile.phone);
    setEditProfile(false);
  };

  // Add useEffect to load saved profile picture
  React.useEffect(() => {
    async function loadProfileImage() {
      try {
        const roomId = profile.room.replace("Kamar ", "");
        const imageUrl = await fetchProfileImage(roomId);
        if (imageUrl) {
          setProfilePicture(imageUrl);
        }
      } catch (error) {
        console.error("Failed to load profile image:", error);
      }
    }

    loadProfileImage();
  }, [profile.room]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF8E7]">
      {/* Header */}
      <header className="bg-[#FFCC00] p-5 flex justify-between items-center rounded-b-2xl shadow-md">
        <h1 className="text-white text-xl font-bold">MiminKost</h1>
        <div className="flex gap-5">
          <Home
            className="text-white hover:scale-110 transition-transform"
            size={24}
          />
          <User
            className="text-white hover:scale-110 transition-transform"
            size={24}
          />
          <LogOut
            className="text-white hover:scale-110 transition-transform"
            size={24}
          />
        </div>
      </header>

      {/* Profile Header */}
      <div className="bg-[#FFCC00] m-5 p-6 rounded-2xl shadow-lg relative transition-all hover:shadow-xl">
        <div className="flex flex-col items-center">
          {/* Profile Picture */}
          <div className="relative mb-5">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-white border-4 border-white shadow-md">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover transition-all"
                  onError={(e) => {
                    console.error("Error loading image:", e);
                    e.currentTarget.onerror = null; // Prevent infinite error loop
                    e.currentTarget.src = "/placeholder.svg"; // Fall back to placeholder
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <User size={42} className="text-gray-400" />
                </div>
              )}
            </div>
            <button
              onClick={triggerInputClick}
              className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-all transform hover:scale-110"
            >
              <Camera size={16} className="text-[#FFCC00]" />
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
                  className="bg-white rounded-lg px-3 py-2 text-gray-800 text-center shadow focus:ring-2 focus:ring-[#FFA500] outline-none"
                />
                <button
                  onClick={saveName}
                  className="text-white hover:scale-110 transition-transform"
                >
                  <Save size={18} />
                </button>
                <button
                  onClick={cancelName}
                  className="text-white hover:scale-110 transition-transform"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-white text-xl font-bold">{profile.name}</h2>
                <button
                  onClick={() => setEditProfile(true)}
                  className="text-white hover:scale-110 transition-transform"
                >
                  <Edit size={18} />
                </button>
              </>
            )}
          </div>

          {/* Room Number */}
          <p className="text-white font-medium bg-[#FFA500] px-4 py-1 rounded-full text-sm">
            {profile.room}
          </p>
        </div>
      </div>

      {/* Profile Content */}
      <div className="flex-1 px-5 pb-5">
        {/* Bio Section */}
        <div className="bg-[#FFCC00] rounded-2xl shadow-lg mb-5 overflow-hidden transition-all hover:shadow-xl">
          <div className="p-4 flex justify-between items-center">
            <h3 className="font-semibold text-white text-lg">Bio</h3>
            {!editBio && (
              <button
                onClick={() => setEditBio(true)}
                className="text-white bg-[#FFA500] p-2 rounded-full hover:scale-110 transition-transform"
              >
                <Edit size={16} />
              </button>
            )}
          </div>
          <div className="bg-white p-5 rounded-b-2xl">
            {editBio ? (
              <div className="space-y-3">
                <textarea
                  value={tempBio}
                  onChange={(e) => setTempBio(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent outline-none transition-all"
                  rows={4}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={saveBio}
                    className="bg-[#FFCC00] text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow hover:bg-[#FFA500] transition-colors"
                  >
                    <Save size={16} />
                    <span>Simpan</span>
                  </button>
                  <button
                    onClick={cancelBio}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-200 transition-colors"
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
        <div className="bg-[#FFCC00] rounded-2xl shadow-lg mb-5 overflow-hidden transition-all hover:shadow-xl">
          <div className="p-4">
            <h3 className="font-semibold text-white text-lg mb-2">
              Informasi Kontak
            </h3>
          </div>
          <div className="bg-white p-5 rounded-b-2xl space-y-5">
            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="bg-[#FFF8E7] p-3 rounded-xl">
                <Phone size={20} className="text-[#FFCC00]" />
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-sm mb-1">Nomor Telepon</p>
                {editProfile ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={tempPhone}
                      onChange={(e) => setTempPhone(e.target.value)}
                      className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-gray-800 border border-gray-200 focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent outline-none"
                    />
                    <button
                      onClick={savePhone}
                      className="text-[#FFCC00] hover:scale-110 transition-transform"
                    >
                      <Save size={18} />
                    </button>
                    <button
                      onClick={cancelPhone}
                      className="text-gray-400 hover:scale-110 transition-transform"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-gray-700 font-medium">{profile.phone}</p>
                    <button
                      onClick={() => setEditProfile(true)}
                      className="text-[#FFCC00] bg-gray-100 p-1 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <Edit size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="bg-[#FFF8E7] p-3 rounded-xl">
                <Mail size={20} className="text-[#FFCC00]" />
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-sm mb-1">Email</p>
                {editProfile ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="email"
                      value={tempEmail}
                      onChange={(e) => setTempEmail(e.target.value)}
                      className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-gray-800 border border-gray-200 focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent outline-none"
                    />
                    <button
                      onClick={saveEmail}
                      className="text-[#FFCC00] hover:scale-110 transition-transform"
                    >
                      <Save size={18} />
                    </button>
                    <button
                      onClick={cancelEmail}
                      className="text-gray-400 hover:scale-110 transition-transform"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-gray-700 font-medium">{profile.email}</p>
                    <button
                      onClick={() => setEditProfile(true)}
                      className="text-[#FFCC00] bg-gray-100 p-1 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <Edit size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="bg-[#FFF8E7] p-3 rounded-xl">
                <MapPin size={20} className="text-[#FFCC00]" />
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-sm mb-1">Alamat</p>
                {editProfile ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={tempAddress}
                      onChange={(e) => setTempAddress(e.target.value)}
                      className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-gray-800 border border-gray-200 focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent outline-none"
                    />
                    <button
                      onClick={saveAddress}
                      className="text-[#FFCC00] hover:scale-110 transition-transform"
                    >
                      <Save size={18} />
                    </button>
                    <button
                      onClick={cancelAddress}
                      className="text-gray-400 hover:scale-110 transition-transform"
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
                      className="text-[#FFCC00] bg-gray-100 p-1 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <Edit size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Join Date */}
            <div className="flex items-start gap-4">
              <div className="bg-[#FFF8E7] p-3 rounded-xl">
                <Calendar size={20} className="text-[#FFCC00]" />
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Tanggal Bergabung</p>
                <p className="text-gray-700 font-medium">{profile.joinDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-5 max-w-md w-full">
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              Sesuaikan Foto Profil
            </h3>
            <div className="flex justify-center mb-4">
              <AvatarEditor
                ref={editorRef}
                image={imageToEdit || ""}
                width={250}
                height={250}
                border={50}
                borderRadius={125}
                color={[255, 255, 255, 0.6]} // RGBA
                scale={scale}
                rotate={0}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zoom
              </label>
              <input
                type="range"
                min="1"
                max="2"
                step="0.01"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCropModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl flex items-center gap-2 hover:bg-gray-200 transition-colors"
              >
                <X size={16} />
                <span>Batal</span>
              </button>
              <button
                onClick={handleSaveCroppedImage}
                className="px-4 py-2 bg-[#FFCC00] text-white rounded-xl flex items-center gap-2 shadow hover:bg-[#FFA500] transition-colors"
              >
                <Check size={16} />
                <span>Simpan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
