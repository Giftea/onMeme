"use client";
import ProfileCard from "@/components/profile/profile-card";
import User from "@/components/profile";
import { usePathname } from "next/navigation";

export default function Home() {
  const pathName = usePathname();
  const addressPathname = pathName.split("/user/")[1];

  return (
    <div>
      <ProfileCard
        userAddress={addressPathname}
        isProfilePage
        isUserPublicPage
      />
      <User address={addressPathname} />
    </div>
  );
}
