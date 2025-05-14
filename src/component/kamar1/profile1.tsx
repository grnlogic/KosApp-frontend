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
import { testSupabaseConnection } from "../../utils/testSupabase";

export default function ProfilePage() {
  // User profile state
  const [profile, setProfile] = useState({
    name: "",
    room: "Kamar 1",
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

  // Image cropping state
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const editorRef = useRef<AvatarEditor | null>(null);

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
            const roomId =
              typeof profile.room === "string"
                ? profile.room.replace("Kamar ", "")
                : profile.room;

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

  //trigger input click
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
      console.log("Mencoba mengambil bio untuk kamar 1...");

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

      // Use hardcoded ID 1 for Kamar 1
      const id = 1;

      const { data, error } = await supabase
        .from("penghuni")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Gagal ambil data profil:", error);
        return;
      }

      console.log("Data profil yang diterima:", data);
      if (data) {
        setProfile({
          name: data.nama || "",
          room: "Kamar 1",
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
      console.error("Error fetching profile data:", error);
    } finally {
      setLoadingBio(false);
      setLoadingProfile(false);
    }
  };

  // Update bio in Supabase with better error handling
  const updateBio = async (id: string | number, newBio: string) => {
    try {
      console.log("Menyimpan bio untuk id=1:", newBio);

      const { data, error } = await supabase
        .from("penghuni")
        .update({ Bio: newBio })
        .eq("id", 1);

      if (error) {
        console.error("Gagal update bio:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal Menyimpan",
          text: `Error: ${error.message}. Pastikan Anda memiliki akses untuk menulis ke database.`,
        });
        throw error;
      }

      console.log("Bio berhasil diperbarui untuk id=1");
      return data;
    } catch (error) {
      console.error("Error saat memperbarui bio:", error);
      throw error;
    }
  };

  //save bio
  const saveBio = () => {
    Swal.fire({
      title: "Simpan perubahan?",
      text: "Apakah Anda yakin ingin menyimpan perubahan?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#FF7A00",
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

  // Similar updates for other save functions
  const savePhone = () => {
    Swal.fire({
      title: "Simpan perubahan nomor telepon?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#FF7A00",
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
    Swal.fire({
      title: "Simpan perubahan email?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#FF7A00",
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
  //cancel email
  const cancelEmail = () => {
    setTempEmail(profile.email);
    setEditProfile(false);
  };

  // Add missing cancelBio function
  const cancelBio = () => {
    setTempBio(profile.bio);
    setEditBio(false);
  };

  // Add missing cancelPhone function
  const cancelPhone = () => {
    setTempPhone(profile.phone);
    setEditProfile(false);
  };

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
        room: "Kamar 1",
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

  // Add useEffect to fetch bio on component mount
  useEffect(() => {
    // Test Supabase connection
    testSupabaseConnection().then((result) => {
      if (result.success) {
        console.log("Supabase connection test passed in profile1!");
      } else {
        console.error(
          "Supabase connection test failed in profile1:",
          result.error
        );
      }
    });

    // First fetch user profile from backend
    fetchUserProfile();

    // Then fetch bio from Supabase if needed
    fetchBio(profile.room);
  }, []);

  // Keep the existing profile image loading effect
  useEffect(() => {
    async function loadProfileImage() {
      try {
        const roomId =
          typeof profile.room === "string"
            ? profile.room.replace("Kamar ", "")
            : profile.room;

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

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF8E7] relative">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF7A00] rounded-full -mt-10 -mr-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FFCC00] rounded-full -mb-10 -ml-10 blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="bg-[#FF7A00] p-4 flex justify-between items-center shadow-md rounded-b-xl z-10 relative">
        <h1 className="text-white text-xl font-bold flex items-center">
          <span className="bg-white text-[#FF7A00] w-8 h-8 rounded-full mr-2 flex items-center justify-center">
            M
          </span>
          MiminKost
        </h1>
        <div className="flex gap-4">
          <button className="text-white hover:bg-[#FF8F1F] p-2 rounded-full transition-all duration-200 hover:scale-110">
            <Home size={24} />
          </button>
          <button className="text-white hover:bg-[#FF8F1F] p-2 rounded-full transition-all duration-200 hover:scale-110">
            <User size={24} />
          </button>
          <button className="text-white hover:bg-[#FF8F1F] p-2 rounded-full transition-all duration-200 hover:scale-110">
            <LogOut size={24} />
          </button>
        </div>
      </header>

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
                className="px-4 py-2 bg-[#FF7A00] text-white rounded-lg flex items-center gap-2"
              >
                <Check size={16} />
                <span>Simpan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Content */}
      {loadingProfile ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="inline-block w-8 h-8 border-4 border-[#FF7A00] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Memuat profil...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-[#FFCC00] to-[#FF9500] m-4 p-6 rounded-2xl shadow-lg relative z-10 border-4 border-white transform hover:scale-[1.01] transition-transform">
            <div className="absolute -top-2 -right-2 bg-white text-[#FF7A00] px-3 py-1 rounded-full text-sm font-bold shadow-md">
              Active
            </div>
            <div className="flex flex-col items-center">
              {/* Profile Picture */}
              <div className="relative mb-4">
                <div className="w-28 h-28 rounded-full overflow-hidden bg-white border-4 border-white shadow-md hover:shadow-lg transition-shadow">
                  {loadingImage ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <div className="w-8 h-8 border-4 border-[#FF7A00] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      onError={(e) => {
                        console.error("Error loading image:", e);
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <User size={40} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <button
                  onClick={triggerInputClick}
                  disabled={loadingImage}
                  className={`absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md transition-all border-2 border-[#FF7A00] ${
                    loadingImage
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100 hover:scale-110 duration-200"
                  }`}
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
                <h2 className="text-white text-2xl font-bold drop-shadow-sm">
                  {profile.name}
                </h2>
                {/* Remove the edit button for username */}
              </div>

              {/* Room Number */}
              <p className="text-white bg-white/20 px-3 py-1 rounded-full text-sm font-medium shadow-inner backdrop-blur-sm">
                {profile.room}
              </p>
            </div>
          </div>

          {/* Profile Content */}
          <div className="flex-1 px-4 pb-4 z-10 relative">
            {/* Bio Section */}
            <div className="bg-white rounded-xl shadow-md mb-5 overflow-hidden border border-[#FF9500]/30 hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-r from-[#FFCC00] to-[#FF9500] p-4 flex justify-between items-center">
                <h3 className="font-medium text-white flex items-center gap-2">
                  <div className="bg-white w-6 h-6 rounded-full flex items-center justify-center">
                    <span className="text-[#FF7A00] text-xs font-bold">
                      Bio
                    </span>
                  </div>
                  <span>Tentang Saya</span>
                </h3>
                {!editBio && (
                  <button
                    onClick={() => setEditBio(true)}
                    className="text-white bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                )}
              </div>
              <div className="bg-white p-5">
                {editBio ? (
                  <div className="space-y-2">
                    <textarea
                      value={tempBio}
                      onChange={(e) => setTempBio(e.target.value)}
                      className="w-full p-3 border rounded-lg shadow-inner focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent outline-none transition-all"
                      rows={4}
                      placeholder="Tuliskan bio Anda di sini..."
                      disabled={savingChanges}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={saveBio}
                        disabled={savingChanges}
                        className={`bg-[#FF7A00] text-white px-4 py-2 rounded-lg flex items-center gap-1 shadow ${
                          savingChanges
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-[#FF8F1F] hover:shadow-md transition-colors"
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
                        className={`bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-1 ${
                          savingChanges
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-300 transition-colors"
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
                        <div className="inline-block w-6 h-6 border-3 border-[#FF7A00] border-t-transparent rounded-full animate-spin mb-2"></div>
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
            <div className="bg-white rounded-xl shadow-md mb-5 overflow-hidden border border-[#FF9500]/30 hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-r from-[#FFCC00] to-[#FF9500] p-4">
                <h3 className="font-medium text-white flex items-center gap-2">
                  <div className="bg-white w-6 h-6 rounded-full flex items-center justify-center">
                    <span className="text-[#FF7A00] text-xs font-bold">
                      Info
                    </span>
                  </div>
                  <span>Informasi Kontak</span>
                </h3>
              </div>
              <div className="bg-white p-5 space-y-4">
                {/* Phone */}
                <div className="flex items-start gap-3 bg-[#FFF8E7]/50 p-3 rounded-lg border border-[#FFF8E7] hover:shadow-sm transition-shadow">
                  <div className="bg-[#FF7A00] p-2 rounded-lg text-white shadow">
                    <Phone size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-500 text-sm font-medium">
                      Nomor Telepon
                    </p>
                    {editProfile ? (
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="text"
                          value={tempPhone}
                          onChange={(e) => setTempPhone(e.target.value)}
                          className="flex-1 bg-white rounded-md px-3 py-2 text-gray-800 border border-gray-200 focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent outline-none"
                        />
                        <button
                          onClick={savePhone}
                          className="text-white bg-[#FF7A00] p-2 rounded-lg hover:bg-[#FF8F1F] transition-colors"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={cancelPhone}
                          className="text-white bg-gray-400 p-2 rounded-lg hover:bg-gray-500 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="text-gray-700 font-medium">
                          {profile.phone}
                        </p>
                        <button
                          onClick={() => setEditProfile(true)}
                          className="text-gray-400 hover:text-[#FF7A00] transition-colors p-1 rounded-full hover:bg-gray-100"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3 bg-[#FFF8E7]/50 p-3 rounded-lg border border-[#FFF8E7] hover:shadow-sm transition-shadow">
                  <div className="bg-[#FF7A00] p-2 rounded-lg text-white shadow">
                    <Mail size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-500 text-sm font-medium">Email</p>
                    {editProfile ? (
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="email"
                          value={tempEmail}
                          onChange={(e) => setTempEmail(e.target.value)}
                          className="flex-1 bg-white rounded-md px-3 py-2 text-gray-800 border border-gray-200 focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent outline-none"
                        />
                        <button
                          onClick={saveEmail}
                          className="text-white bg-[#FF7A00] p-2 rounded-lg hover:bg-[#FF8F1F] transition-colors"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={cancelEmail}
                          className="text-white bg-gray-400 p-2 rounded-lg hover:bg-gray-500 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="text-gray-700 font-medium">
                          {profile.email}
                        </p>
                        <button
                          onClick={() => setEditProfile(true)}
                          className="text-gray-400 hover:text-[#FF7A00] transition-colors p-1 rounded-full hover:bg-gray-100"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats Section - New Addition */}
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div className="bg-[#FFF8E7] p-3 rounded-lg text-center hover:shadow-md transition-shadow">
                    <p className="text-[#FF7A00] text-xl font-bold">12</p>
                    <p className="text-gray-500 text-xs">Bulan</p>
                  </div>
                  <div className="bg-[#FFF8E7] p-3 rounded-lg text-center hover:shadow-md transition-shadow">
                    <p className="text-[#FF7A00] text-xl font-bold">100%</p>
                    <p className="text-gray-500 text-xs">Pembayaran</p>
                  </div>
                  <div className="bg-[#FFF8E7] p-3 rounded-lg text-center hover:shadow-md transition-shadow">
                    <p className="text-[#FF7A00] text-xl font-bold">5★</p>
                    <p className="text-gray-500 text-xs">Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
