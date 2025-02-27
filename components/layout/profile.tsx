"use client";
import ProfileCard from "@/components/composed/profile-card";
import User from "@/components/profile";
import { MemeDetailModal } from "../modals/meme-detail-modal";
import { useEffect, useState } from "react";

export default function ProfileLayout({
  address,
  meme,
}: {
  address: string;
  meme: {
    id: number;
    ownerAddress: string;
    templateId: string;
    imageUrl: string;
    isPublic: boolean | null;
    createdAt: Date | string | null;
  };
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (meme.imageUrl) {
      setIsModalOpen(true);
    }
  }, []);

  function handleCloseModal() {
    setIsModalOpen(false);
  }
  return (
    <div>
      <ProfileCard userAddress={address} isProfilePage isUserPublicPage />
      <User address={address} />
      {meme && (
        <MemeDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          imageUrl={meme.imageUrl}
          meme={meme} // Pass the meme object
          address={address || null}
        />
      )}
    </div>
  );
}
