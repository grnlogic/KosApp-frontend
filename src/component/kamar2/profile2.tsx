import React, { useEffect, useState, useRef } from "react";
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
    room: 2,
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

  // Saat login berhasil, simpan token ke localStorage
  // localStorage.setItem("authToken", token); // Removed or define 'token' before using

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
              profile.room
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

  //trigger input click
  const triggerInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  //save bio
  const saveBio = () => {
    Swal.fire({
      title: "Simpan perubahan?",
      text: "Perubahan akan disimpan",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#FF9500",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, simpan!",
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
            position: "center",
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

  //cancel phone
  const cancelPhone = () => {
    setTempPhone(profile.phone);
    setEditProfile(false);
  };

  //cancel email
  const cancelEmail = () => {
    setTempEmail(profile.email);
    setEditProfile(false);
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
      confirmButtonColor: "#FF9500",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, simpan!",
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
            position: "center",
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
      confirmButtonColor: "#FF9500",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, simpan!",
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
            position: "center",
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

  // Fetch bio from Supabase
  const fetchBio = async (roomId: string | number) => {
    try {
      setLoadingBio(true);
      setLoadingProfile(true);
      console.log("Mencoba mengambil bio untuk kamar 2...");

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

      // Query yang benar, tanpa menggunakan maybeSingle() yang mungkin menyebabkan error
      const { data, error } = await supabase
        .from("penghuni")
        .select("*")
        .eq("id", 2)
        .single();

      if (error) {
        console.error("Gagal mengambil data profil:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal Mengambil Data",
          text: `Error: ${error.message}. Coba segarkan halaman.`,
        });
        return;
      }

      console.log("Data profil yang diterima:", data);
      if (data) {
        setProfile({
          name: data.nama || "",
          room: 2,
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
      console.error("Error saat mengambil bio:", error);
    } finally {
      setLoadingBio(false);
      setLoadingProfile(false);
    }
  };

  // Update bio in Supabase - perbaikan dari SELECT menjadi UPDATE
  const updateBio = async (id: string | number, newBio: string) => {
    try {
      console.log("Menyimpan bio untuk id=2:", newBio);

      // PERBAIKAN: Ganti SELECT dengan UPDATE yang benar
      const { data, error } = await supabase
        .from("penghuni")
        .update({ Bio: newBio })
        .eq("id", 2);

      if (error) {
        console.error("Gagal update bio:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal Menyimpan",
          text: `Error: ${error.message}. Pastikan Anda memiliki akses untuk menulis ke database.`,
        });
        throw error;
      }

      console.log("Bio berhasil diperbarui untuk id=2");
      return data;
    } catch (error) {
      console.error("Error saat memperbarui bio:", error);
      throw error;
    }
  };

  // Add this function to fetch user profile
  const fetchUserProfile = async () => {
    try {
      setLoadingProfile(true);

      // Ambil data dari localStorage
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      console.log("Data pengguna dari localStorage:", userData);

      // Update profile state dengan data dari localStorage
      setProfile({
        name: userData.username || "",
        room: 2,
        phone: userData.phoneNumber || "",
        email: userData.email || "",
        bio: profile.bio, // Pertahankan bio yang ada
      });

      // Tetap panggil fetchBio untuk mendapatkan bio dari Supabase
      fetchBio(profile.room);
    } catch (error) {
      console.error("Error mengambil profil pengguna:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal memuat profil",
        text: "Tidak dapat memuat data profil. Silakan coba lagi nanti.",
      });
    } finally {
      setLoadingProfile(false);
    }
  };

  // Add useEffect to fetch bio on component mount
  useEffect(() => {
    // First fetch user profile from backend
    fetchUserProfile();

    // Then fetch bio from Supabase if needed
    fetchBio(profile.room);
  }, []);

  // No need for the previous fetchProfilePicture implementation since we're using Supabase URLs directly
  useEffect(() => {
    // You can still fetch the profile image from Supabase if needed
    // This is a placeholder for potential future implementation
  }, [profile.room]);

  // Load profile picture from localStorage on component mount
  useEffect(() => {
    async function loadProfileImage() {
      try {
        const imageUrl = await fetchProfileImage(profile.room);
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
    <div className="flex flex-col min-h-screen bg-[#FFF8E7] relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#FFCC00]/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#FF9500]/20 blur-3xl"></div>
        <div className="absolute top-1/3 left-10 w-6 h-6 rounded-full bg-[#FFCC00] opacity-20"></div>
        <div className="absolute top-2/3 right-10 w-4 h-4 rounded-full bg-[#FF9500] opacity-20"></div>
        <div className="absolute top-1/4 right-1/4 w-8 h-8 rounded-full border-2 border-[#FFCC00] opacity-20"></div>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-[#FFCC00] to-[#FF9500] p-5 flex justify-between items-center shadow-md rounded-b-2xl z-10 relative">
        <h1 className="text-white text-xl font-bold flex items-center gap-2">
          <span className="bg-white text-[#FF9500] w-8 h-8 rounded-full flex items-center justify-center font-bold">
            M
          </span>
          MiminKost
        </h1>
        <div className="flex gap-4">
          <Home
            className="text-white hover:text-[#FFF8E7] transition-colors cursor-pointer hover:scale-110 transform duration-200"
            size={24}
          />
          <User
            className="text-white hover:text-[#FFF8E7] transition-colors cursor-pointer hover:scale-110 transform duration-200"
            size={24}
          />
          <LogOut
            className="text-white hover:text-[#FFF8E7] transition-colors cursor-pointer hover:scale-110 transform duration-200"
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
          <div className="bg-gradient-to-br from-[#FFCC00] to-[#FF9500] m-5 p-6 rounded-2xl shadow-lg relative z-10 border-4 border-white transform hover:scale-[1.01] transition-transform">
            {/* Status badge */}
            <div className="absolute -top-3 -right-3 bg-white text-[#FF9500] px-3 py-1 rounded-full text-sm font-bold shadow-md flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Active</span>
            </div>

            <div className="flex flex-col items-center">
              {/* Profile Picture */}
              <div className="relative mb-5">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-white border-4 border-white shadow-lg hover:shadow-xl transition-all duration-300">
                  {loadingImage ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <div className="w-8 h-8 border-4 border-[#FFCC00] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover hover:scale-110 transition-all duration-500"
                      onError={(e) => {
                        console.error("Error loading image:", e);
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <User size={50} className="text-gray-300" />
                    </div>
                  )}
                </div>
                <button
                  onClick={triggerInputClick}
                  disabled={loadingImage}
                  className={`absolute bottom-0 right-0 bg-white p-3 rounded-full shadow-lg border-2 border-[#FF9500] ${
                    loadingImage
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100 hover:scale-110 transition-transform"
                  }`}
                >
                  <Camera size={18} className="text-[#FF9500]" />
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
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-white text-2xl font-bold drop-shadow-sm">
                  {profile.name}
                </h2>
                {/* Remove the edit button for username */}
              </div>

              {/* Room Number */}
              <p className="text-white bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium shadow-inner">
                Kamar {profile.room}
              </p>
            </div>
          </div>

          {/* Profile Content */}
          <div className="flex-1 px-5 pb-6 z-10 relative">
            {/* Bio Section */}
            <div className="bg-white rounded-2xl shadow-md mb-5 overflow-hidden border border-[#FFCC00]/30 hover:shadow-lg transition-all">
              <div className="p-4 flex justify-between items-center bg-gradient-to-r from-[#FFCC00] to-[#FF9500]">
                <h3 className="font-medium text-white flex items-center gap-2">
                  <div className="bg-white w-6 h-6 rounded-full flex items-center justify-center shadow-inner">
                    <span className="text-[#FF9500] text-xs font-bold">
                      Bio
                    </span>
                  </div>
                  <span>Tentang Saya</span>
                </h3>
                {!editBio && (
                  <button
                    onClick={() => setEditBio(true)}
                    className="text-white bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
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
                      className="w-full p-4 border border-gray-200 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent"
                      rows={4}
                      placeholder="Tuliskan bio Anda di sini..."
                      disabled={savingChanges}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={saveBio}
                        disabled={savingChanges}
                        className={`bg-gradient-to-r from-[#FFCC00] to-[#FF9500] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md ${
                          savingChanges
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:opacity-90 transition-opacity"
                        }`}
                      >
                        {savingChanges ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                            <span>Menyimpan...</span>
                          </>
                        ) : (
                          <>
                            <Save size={16} />
                            <span>Simpan</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={cancelBio}
                        disabled={savingChanges}
                        className={`bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 ${
                          savingChanges
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-200 transition-colors"
                        }`}
                      >
                        <X size={16} />
                        <span>Batal</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#FFF8E7]/50 p-4 rounded-lg border border-[#FFF8E7] min-h-[100px] flex items-center justify-center">
                    {loadingBio ? (
                      <div className="text-center p-4">
                        <div className="inline-block w-6 h-6 border-3 border-[#FFCC00] border-t-transparent rounded-full animate-spin mb-2"></div>
                        <p className="text-gray-500 text-sm">Memuat bio...</p>
                      </div>
                    ) : (
                      <p className="text-gray-700 leading-relaxed">
                        {profile.bio ||
                          "Belum ada bio. Klik tombol edit untuk menambahkan."}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-md mb-5 overflow-hidden border border-[#FFCC00]/30 hover:shadow-lg transition-all">
              <div className="p-4 bg-gradient-to-r from-[#FFCC00] to-[#FF9500]">
                <h3 className="font-medium text-white flex items-center gap-2">
                  <div className="bg-white w-6 h-6 rounded-full flex items-center justify-center shadow-inner">
                    <span className="text-[#FF9500] text-xs font-bold">
                      Info
                    </span>
                  </div>
                  <span>Informasi Kontak</span>
                </h3>
              </div>
              <div className="bg-white p-5 space-y-5">
                {/* Phone */}
                <div className="flex items-start gap-4 bg-[#FFF8E7]/50 p-3 rounded-lg border border-[#FFF8E7] hover:shadow-sm transition-shadow">
                  <div className="bg-gradient-to-br from-[#FFCC00] to-[#FF9500] p-3 rounded-full text-white shadow-md">
                    <Phone size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-500 text-sm font-medium">
                      Nomor Telepon
                    </p>
                    <p className="text-gray-700 font-medium">
                      {profile.phone || "Belum tersedia"}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 bg-[#FFF8E7]/50 p-3 rounded-lg border border-[#FFF8E7] hover:shadow-sm transition-shadow">
                  <div className="bg-gradient-to-br from-[#FFCC00] to-[#FF9500] p-3 rounded-full text-white shadow-md">
                    <Mail size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-500 text-sm font-medium">Email</p>
                    <p className="text-gray-700 font-medium">
                      {profile.email || "Belum tersedia"}
                    </p>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-3 mt-5">
                  <div className="bg-white p-4 rounded-xl text-center border border-[#FFCC00]/20 shadow-sm hover:shadow-md transition-all hover:scale-105 transform duration-200">
                    <p className="text-[#FF9500] text-xl font-bold">9</p>
                    <p className="text-gray-500 text-xs">Bulan</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl text-center border border-[#FFCC00]/20 shadow-sm hover:shadow-md transition-all hover:scale-105 transform duration-200">
                    <p className="text-[#FF9500] text-xl font-bold">100%</p>
                    <p className="text-gray-500 text-xs">Pembayaran</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl text-center border border-[#FFCC00]/20 shadow-sm hover:shadow-md transition-all hover:scale-105 transform duration-200">
                    <p className="text-[#FF9500] text-xl font-bold">4.8★</p>
                    <p className="text-gray-500 text-xs">Rating</p>
                  </div>
                </div>

                {/* Additional Info - Modified without join date */}
                <div className="bg-gradient-to-r from-[#FFCC00]/10 to-[#FF9500]/10 p-4 rounded-xl mt-3">
                  <p className="text-sm text-center text-gray-600">
                    Status keanggotaan{" "}
                    <span className="font-medium">Premium</span> • Kamar{" "}
                    <span className="font-medium">2</span>
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
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg flex items-center gap-2"
              >
                <X size={16} />
                <span>Batal</span>
              </button>
              <button
                onClick={handleSaveCroppedImage}
                className="px-4 py-2 bg-gradient-to-r from-[#FFCC00] to-[#FF9500] text-white rounded-lg flex items-center gap-2"
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
