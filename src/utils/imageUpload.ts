import { supabase } from "./supabaseClient";

// Helper to delete previous profile image
const deletePreviousProfileImage = async (
  roomId: number | string
): Promise<void> => {
  try {
    // First, list files that match the pattern for this room
    const { data: existingFiles, error: listError } = await supabase.storage
      .from("kos-images")
      .list("", {
        search: `room_${roomId}_`,
      });

    if (listError) {
      console.error("Error listing files:", listError.message);
      return;
    }

    // If files exist, delete them
    if (existingFiles && existingFiles.length > 0) {
      const filesToRemove = existingFiles.map((file) => file.name);

      console.log("Removing previous profile images:", filesToRemove);

      const { error: removeError } = await supabase.storage
        .from("kos-images")
        .remove(filesToRemove);

      if (removeError) {
        console.error("Error removing files:", removeError.message);
      }
    }
  } catch (error) {
    console.error("Error in delete operation:", error);
  }
};

// Add this new function to fetch a profile image by room number
export const fetchProfileImage = async (
  roomId: string | number
): Promise<string | null> => {
  try {
    // Update the path to match where the files are actually stored
    // The upload seems to be saving to kos-images bucket with room_X_profile.png format
    const { data, error } = await supabase.storage
      .from("kos-images") // Use the correct bucket name
      .download(`room_${roomId}_profile.png`); // Match the filename format

    if (error) {
      console.error("Error fetching profile image:", error);
      return null;
    }

    if (!data) return null;

    // Create URL from the blob data
    const url = URL.createObjectURL(data);
    return url;
  } catch (error) {
    console.error("Error in fetchProfileImage:", error);
    return null;
  }
};

export const uploadImage = async (
  file: File,
  roomId?: number | string
): Promise<string | null> => {
  if (!roomId) {
    console.error("Room ID is required for image upload");
    return null;
  }

  // Use a consistent naming pattern that includes roomId but is still unique
  const fileExt = file.name.split(".").pop();
  const fileName = `room_${roomId}_profile.${fileExt}`;
  const filePath = fileName; // Store directly in the root of the bucket

  console.log(`Uploading image to path: ${filePath}`);

  try {
    // Delete any previous profile image for this room
    await deletePreviousProfileImage(roomId);

    // Upload the new image
    const { data, error } = await supabase.storage
      .from("kos-images")
      .upload(filePath, file, {
        cacheControl: "0", // Disable caching
        upsert: true, // Override any existing file with the same name
      });

    if (error) {
      console.error("Upload error:", error.message);
      return null;
    }

    console.log("Upload successful:", data);

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from("kos-images")
      .getPublicUrl(filePath);

    console.log("Public URL data:", publicUrlData);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error("Unexpected error during upload:", err);
    return null;
  }
};
