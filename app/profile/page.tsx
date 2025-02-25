"use client";
import ProfileCard from "@/components/profile/profile-card";
import User from "@/components/profile";
import { useAddress } from "@chopinframework/react";

export default function Home() {
  const { address } = useAddress();

  return (
    <div>
      <ProfileCard userAddress={address} isProfilePage />
      <User address={address} />
    </div>
  );
}
