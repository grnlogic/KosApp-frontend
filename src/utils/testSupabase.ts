import { supabase } from "./supabaseClient";

// Fungsi untuk menguji koneksi Supabase dan mengecek tabel
export const testSupabaseConnection = async () => {
  try {

    // Cek koneksi dasar
    const { data: healthData, error: healthError } = await supabase
      .from("penghuni")
      .select("count()", { count: "exact" });

    if (healthError) {
      console.error("Pemeriksaan koneksi Supabase gagal:", healthError);
      return {
        success: false,
        error: healthError,
        message: "Koneksi ke database gagal",
      };
    }


    // Coba ambil semua data untuk melihat apa yang tersedia
    const { data, error } = await supabase.from("penghuni").select("*");

    if (error) {
      console.error("Query tabel penghuni gagal:", error);
      return {
        success: false,
        error,
        message: "Gagal mengambil data dari tabel penghuni",
      };
    }


    // Tampilkan struktur data
    if (data && data.length > 0) {
    }

    // Coba ambil data untuk setiap ID
    const idResults = [];
    for (let id = 1; id <= 4; id++) {
      const { data: rowData, error: rowError } = await supabase
        .from("penghuni")
        .select("*")
        .eq("id", id);

      if (rowError) {
        console.error(`Error saat mengambil data untuk ID ${id}:`, rowError);
        idResults.push({ id, success: false, error: rowError.message });
      } else {
        idResults.push({
          id,
          success: true,
          hasData: rowData && rowData.length > 0,
          data: rowData,
        });
      }
    }

    return {
      success: true,
      data,
      idResults,
      message: "Koneksi dan query berhasil",
    };
  } catch (error) {
    console.error("Error selama pengujian Supabase:", error);
    return {
      success: false,
      error,
      message: "Terjadi kesalahan tak terduga saat menguji koneksi",
    };
  }
};

// Jalankan tes dan tampilkan hasilnya dalam format yang mudah dibaca
export const runDiagnostic = async () => {
  try {
    const result = await testSupabaseConnection();
    return result;
  } catch (error) {
    return { success: false, error };
  }
};

// Jalankan diagnosis saat modul diimport
runDiagnostic();
