import React, { useState, useRef, useEffect } from "react";
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
import { supabase } from "../../utils/supabaseClient";
import Swal from "sweetalert2";
import AvatarEditor from "react-avatar-editor";

export default function ProfilePage() {
  // User profile state
  const [profile, setProfile] = useState({
    name: "",
    room: "Kamar 3",
    phone: "",
    email: "",
    bio: "",
  });

  // Loading states
  const [loadingBio, setLoadingBio] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingChanges, setSavingChanges] = useState(false);

  //Profile pictur
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  //edit profile
  const [editBio, setEditBio] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [editingName, setEditingName] = useState(profile.name);
  const [editingEmail, setEditingEmail] = useState(profile.email);
  const [editingPhone, setEditingPhone] = useState(profile.phone);
  const [tempBio, setTempBio] = useState(profile.bio);
  const [tempName, setTempName] = useState(profile.name);
  const [tempEmail, setTempEmail] = useState(profile.email);
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
            setLoadingImage(true);
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
          } finally {
            setLoadingImage(false);
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

  // Fetch bio from Supabase
  const fetchBio = async (roomId: string | number) => {
    try {
      setLoadingBio(true);
      setLoadingProfile(true);
      console.log("Mencoba mengambil bio untuk kamar 3...");

      // Periksa apakah koneksi ke Supabase berfungsi
      const testConnection = await supabase
        .from("penghuni")
        .select("*")
        .limit(1);
      if (testConnection.error) {
        console.error("Koneksi ke Supabase gagal:", testConnection.error);
        Swal.fire({
          icon: "error",
          title: "Koneksi Database Gagal",
          text: "Tidak dapat terhubung ke Supabase. Periksa koneksi internet Anda.",
        });
        return;
      } else {
        console.log("Test koneksi berhasil:", testConnection.data);
      }

      // Use hardcoded ID 3 for Kamar 3
      const id = 3;

      const { data, error } = await supabase
        .from("penghuni")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Gagal ambil bio:", error);
        return;
      }

      console.log("Data bio yang diterima:", data);
      if (data) {
        setProfile({
          name: data.nama || "",
          room: "Kamar 3",
          phone: data.telepon || "",
          email: data.email || "",
          bio: data.Bio || "",
        });
        setTempBio(data.Bio || "");
        setTempName(data.nama || "");
        setTempEmail(data.email || "");
        setTempPhone(data.telepon || "");
      }
    } catch (error) {
      console.error("Error fetching bio:", error);
    } finally {
      setLoadingBio(false);
      setLoadingProfile(false);
    }
  };

  // Update bio in Supabase with better error handling
  const updateBio = async (id: string | number, newBio: string) => {
    try {
      console.log("Menyimpan bio untuk id=3:", newBio);

      const { data, error } = await supabase
        .from("penghuni")
        .update({ Bio: newBio })
        .eq("id", 3);

      if (error) {
        console.error("Gagal update bio:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal Menyimpan",
          text: `Error: ${error.message}. Pastikan Anda memiliki akses untuk menulis ke database.`,
        });
        throw error;
      }

      console.log("Bio berhasil diperbarui untuk id=3");
      return data;
    } catch (error) {
      console.error("Error saat memperbarui bio:", error);
      throw error;
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setSavingChanges(true);
          Swal.fire({
            title: "Menyimpan...",
            didOpen: () => {
              Swal.showLoading();
            },
            allowOutsideClick: false,
            allowEscapeKey: false,
          });

          // Update bio in Supabase
          await updateBio(profile.room, tempBio);

          // Update local state
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
        } catch (error) {
          console.error("Error updating bio:", error);
          Swal.fire({
            icon: "error",
            title: "Gagal menyimpan bio",
            text: "Terjadi kesalahan saat menyimpan bio Anda. Silakan coba lagi.",
          });
        } finally {
          setSavingChanges(false);
        }
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

  // Add function to update user data in the backend
  const updateUserProfile = async (field: string, value: string) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No auth token found");
      }

      // Only allow updating email or phoneNumber
      if (field !== "email" && field !== "phoneNumber") {
        throw new Error("Cannot update this field");
      }

      const response = await fetch(
        "https://backend-kos-app.up.railway.app/api/auth/update-profile",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ [field]: value }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      throw error;
    }
  };

  // Update saveEmail function to use API
  const saveEmail = () => {
    Swal.fire({
      title: "Simpan perubahan email?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#FFCC00",
      cancelButtonColor: "#d33",
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setSavingChanges(true);
          Swal.fire({
            title: "Menyimpan...",
            didOpen: () => {
              Swal.showLoading();
            },
            allowOutsideClick: false,
            allowEscapeKey: false,
          });

          // Update email in backend
          await updateUserProfile("email", tempEmail);

          // Update local state
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
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Gagal menyimpan email",
            text: "Terjadi kesalahan saat menyimpan email Anda. Silakan coba lagi.",
          });
        } finally {
          setSavingChanges(false);
        }
      }
    });
  };

  // Update savePhone function to use API
  const savePhone = () => {
    Swal.fire({
      title: "Simpan perubahan nomor telepon?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#FFCC00",
      cancelButtonColor: "#d33",
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setSavingChanges(true);
          Swal.fire({
            title: "Menyimpan...",
            didOpen: () => {
              Swal.showLoading();
            },
            allowOutsideClick: false,
            allowEscapeKey: false,
          });

          // Update phone in backend
          await updateUserProfile("phoneNumber", tempPhone);

          // Update local state
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
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Gagal menyimpan nomor telepon",
            text: "Terjadi kesalahan saat menyimpan nomor telepon Anda. Silakan coba lagi.",
          });
        } finally {
          setSavingChanges(false);
        }
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

  //cancel phone
  const cancelPhone = () => {
    setTempPhone(profile.phone);
    setEditProfile(false);
  };

  // Add useEffect to fetch bio on component mount
  useEffect(() => {
    fetchBio(profile.room);
  }, []);

  // Add useEffect to load saved profile picture
  useEffect(() => {
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

  // Add this function to fetch user profile
  const fetchUserProfile = async () => {
    try {
      setLoadingProfile(true);

      // Get auth token from localStorage
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("No auth token found");
        return;
      }

      const response = await fetch(
        "https://backend-kos-app.up.railway.app/api/auth/user-info",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const userData = await response.json();
      console.log("User data from backend:", userData);

      // Update profile state with backend data
      setProfile({
        name: userData.username || "", // Username comes from backend
        room: "Kamar 3",
        phone: userData.phoneNumber || "",
        email: userData.email || "",
        bio: profile.bio, // Keep existing bio if available
      });

      // Also update temp values
      setTempPhone(userData.phoneNumber || "");
      setTempEmail(userData.email || "");
    } catch (error) {
      console.error("Error fetching user profile:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to load profile",
        text: "Could not connect to the server. Please try again later.",
      });
    } finally {
      setLoadingProfile(false);
    }
  };

  // Update the useEffect
  useEffect(() => {
    // First fetch user profile from backend
    fetchUserProfile();

    // Then fetch bio from Supabase if needed
    fetchBio(profile.room);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF8E7] relative">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#FFCC00]/10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-[#FFCC00]/10 blur-3xl"></div>
        <div className="grid grid-cols-6 gap-4 opacity-5 absolute inset-0">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-[#FFCC00]"></div>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="bg-[#FFCC00] p-5 flex justify-between items-center rounded-b-2xl shadow-md z-10 relative">
        <h1 className="text-white text-xl font-bold flex items-center gap-2">
          <span className="bg-white text-[#FFCC00] w-8 h-8 rounded-full flex items-center justify-center font-bold">
            M
          </span>
          MiminKost
        </h1>
        <div className="flex gap-5">
          <Home
            className="text-white hover:scale-110 transition-transform duration-200 cursor-pointer"
            size={24}
          />
          <User
            className="text-white hover:scale-110 transition-transform duration-200 cursor-pointer"
            size={24}
          />
          <LogOut
            className="text-white hover:scale-110 transition-transform duration-200 cursor-pointer"
            size={24}
          />
        </div>
      </header>

      {loadingProfile ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="inline-block w-8 h-8 border-4 border-[#FFCC00] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Memuat profil...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Profile Header */}
          <div className="bg-[#FFCC00] m-5 p-6 rounded-2xl shadow-lg relative z-10 transform hover:scale-[1.01] transition-transform border-4 border-white">
            {/* Status Badge */}
            <div className="absolute -top-3 -right-3 bg-white text-[#FFCC00] px-3 py-1 rounded-full text-sm font-bold shadow-md flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Active</span>
            </div>

            <div className="flex flex-col items-center">
              {/* Profile Picture */}
              <div className="relative mb-5">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-white border-4 border-white shadow-md hover:shadow-lg transition-all duration-300">
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover hover:scale-110 transition-all duration-500"
                      onError={(e) => {
                        console.error("Error loading image:", e);
                        e.currentTarget.onerror = null; // Prevent infinite error loop
                        e.currentTarget.src = "/placeholder.svg"; // Fall back to placeholder
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <User size={42} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <button
                  onClick={triggerInputClick}
                  className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-all transform hover:scale-110 border-2 border-[#FFCC00]"
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
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-white text-2xl font-bold drop-shadow-sm">
                  {profile.name}
                </h2>
                {/* Remove the edit button for username */}
              </div>

              {/* Room Number */}
              <p className="text-white font-medium bg-[#FFA500] px-4 py-1 rounded-full text-sm shadow-inner">
                {profile.room}
              </p>
            </div>
          </div>

          {/* Profile Content */}
          <div className="flex-1 px-5 pb-5 z-10 relative">
            {/* Bio Section */}
            <div className="bg-[#FFCC00] rounded-2xl shadow-lg mb-5 overflow-hidden transition-all hover:shadow-xl border-2 border-white">
              <div className="p-4 flex justify-between items-center">
                <h3 className="font-semibold text-white text-lg flex items-center gap-2">
                  <div className="bg-white w-6 h-6 rounded-full flex items-center justify-center">
                    <span className="text-[#FFCC00] text-xs font-bold">
                      Bio
                    </span>
                  </div>
                  <span>Tentang Saya</span>
                </h3>
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
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent outline-none transition-all shadow-inner"
                      rows={4}
                      placeholder="Tuliskan bio Anda di sini..."
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
                  <div className="bg-[#FFF8E7]/50 p-4 rounded-lg border border-[#FFF8E7]">
                    <p className="text-gray-700 leading-relaxed">
                      {profile.bio}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-[#FFCC00] rounded-2xl shadow-lg mb-5 overflow-hidden transition-all hover:shadow-xl border-2 border-white">
              <div className="p-4">
                <h3 className="font-semibold text-white text-lg flex items-center gap-2">
                  <div className="bg-white w-6 h-6 rounded-full flex items-center justify-center">
                    <span className="text-[#FFCC00] text-xs font-bold">
                      Info
                    </span>
                  </div>
                  <span>Informasi Kontak</span>
                </h3>
              </div>
              <div className="bg-white p-5 rounded-b-2xl space-y-5">
                {/* Phone */}
                <div className="flex items-start gap-4 bg-[#FFF8E7]/50 p-3 rounded-lg border border-[#FFF8E7] hover:shadow-sm transition-shadow">
                  <div className="bg-[#FFF8E7] p-3 rounded-xl">
                    <Phone size={20} className="text-[#FFCC00]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-500 text-sm mb-1 font-medium">
                      Nomor Telepon
                    </p>
                    {editProfile ? (
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="text"
                          value={tempPhone}
                          onChange={(e) => setTempPhone(e.target.value)}
                          className="flex-1 bg-white rounded-lg px-3 py-2 text-gray-800 border border-gray-200 focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent outline-none shadow-inner"
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
                        <p className="text-gray-700 font-medium">
                          {profile.phone}
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

                {/* Email */}
                <div className="flex items-start gap-4 bg-[#FFF8E7]/50 p-3 rounded-lg border border-[#FFF8E7] hover:shadow-sm transition-shadow">
                  <div className="bg-[#FFF8E7] p-3 rounded-xl">
                    <Mail size={20} className="text-[#FFCC00]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-500 text-sm mb-1 font-medium">
                      Email
                    </p>
                    {editProfile ? (
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="email"
                          value={tempEmail}
                          onChange={(e) => setTempEmail(e.target.value)}
                          className="flex-1 bg-white rounded-lg px-3 py-2 text-gray-800 border border-gray-200 focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent outline-none shadow-inner"
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
                        <p className="text-gray-700 font-medium">
                          {profile.email}
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

                {/* Stats Section */}
                <div className="grid grid-cols-3 gap-3 mt-2">
                  <div className="bg-[#FFF8E7] p-3 rounded-lg text-center shadow-sm hover:shadow transform hover:scale-105 transition-all">
                    <p className="text-[#FFCC00] text-xl font-bold">8</p>
                    <p className="text-gray-500 text-xs">Bulan</p>
                  </div>
                  <div className="bg-[#FFF8E7] p-3 rounded-lg text-center shadow-sm hover:shadow transform hover:scale-105 transition-all">
                    <p className="text-[#FFCC00] text-xl font-bold">100%</p>
                    <p className="text-gray-500 text-xs">Pembayaran</p>
                  </div>
                  <div className="bg-[#FFF8E7] p-3 rounded-lg text-center shadow-sm hover:shadow transform hover:scale-105 transition-all">
                    <p className="text-[#FFCC00] text-xl font-bold">4.9★</p>
                    <p className="text-gray-500 text-xs">Rating</p>
                  </div>
                </div>

                {/* Tenure Info */}
                <div className="bg-gradient-to-r from-[#FFCC00]/10 to-[#FFA500]/10 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">
                    Status keanggotaan{" "}
                    <span className="font-medium text-[#FFCC00]">Premium</span>{" "}
                    • Kamar <span className="font-medium">3</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

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
