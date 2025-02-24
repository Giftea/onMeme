import ProfileCard from "@/components/profile/ProfileCard";
import User from "@/components/profile";
import { getAddress } from "@chopinframework/next";

export default async function Home() {
  const address = await getAddress();

  return (
    <div>
      <ProfileCard userAddress={address} isProfilePage />
      <User address={address} />
    </div>
  );
}
