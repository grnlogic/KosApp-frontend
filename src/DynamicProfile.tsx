import React from "react";
import { useParams } from "react-router-dom";

const DynamicProfile = ({
  profileComponents,
}: {
  profileComponents: { [key: string]: React.ComponentType };
}) => {
  const { roomId } = useParams<{ roomId: string }>();

  // Cari komponen berdasarkan roomId
  const ProfileComponent = roomId ? profileComponents[roomId] : null;

  if (!ProfileComponent) {
    return <div>Profile untuk kamar ini tidak ditemukan.</div>;
  }

  return <ProfileComponent />;
};

export default DynamicProfile;