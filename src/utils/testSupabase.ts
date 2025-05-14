import { supabase } from "./supabaseClient";

// Fungsi untuk menguji koneksi Supabase dan mengecek tabel
export const testSupabaseConnection = async () => {
  try {
    console.log("Menguji koneksi Supabase...");

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

    console.log("Pemeriksaan koneksi Supabase berhasil:", healthData);

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

    console.log("Semua baris tabel:", data);

    // Tampilkan struktur data
    if (data && data.length > 0) {
      console.log("Struktur data tabel penghuni:", Object.keys(data[0]));
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
        console.log(`Data untuk ID ${id}:`, rowData);
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
    console.log("===== MEMULAI DIAGNOSIS SUPABASE =====");
    const result = await testSupabaseConnection();
    console.log("=== HASIL DIAGNOSIS SUPABASE ===");
    console.log(`Status: ${result.success ? "SUKSES" : "GAGAL"}`);
    console.log(`Pesan: ${result.message}`);

    if (result.success && result.idResults) {
      console.log("=== DATA PER ID ===");
      for (const idResult of result.idResults) {
        console.log(
          `ID ${idResult.id}: ${
            idResult.success
              ? idResult.hasData
                ? "Data ditemukan"
                : "Data tidak ditemukan"
              : "Error"
          }`
        );
      }

      console.log("=== KOLOM TABEL ===");
      if (result.data && result.data.length > 0) {
        console.log("Kolom yang tersedia:", Object.keys(result.data[0]));
      }
    }

    return result;
  } catch (error) {
    console.error("Error menjalankan diagnosis:", error);
    return { success: false, error };
  }
};

// Jalankan diagnosis saat modul diimport
runDiagnostic();
