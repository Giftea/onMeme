import ProfileCard from "@/components/profile/ProfileCard";
import { getAddress } from "@/lib/chopin-server";

export default async function Home() {
  const address = await getAddress();

  return (
    <div>
      <ProfileCard initialAddress={address} isProfilePage />
    </div>
  );
}
