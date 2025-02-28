"use client";

import ProfileLayout from "@/components/layout/profile";
import { useAddress } from "@chopinframework/react";

export default function Home() {
  const { address } = useAddress();

  return (
    <div>
      <ProfileLayout
        address={address}
        isProfilePage={true}
        isUserPublicPage={false}
      />
    </div>
  );
}
