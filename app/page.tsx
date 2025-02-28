import MemeGeneratorX from "@/components/meme-generator";
import ProfileCard from "@/components/composed/profile-card";
import { getAddress } from "@chopinframework/next";

export default async function Home() {
  const address = await getAddress();

  return (
    <>
      {address && (
        <ProfileCard
          userAddress={address}
          isProfilePage={false}
          isUserPublicPage={false}
        />
      )}

      <MemeGeneratorX />
    </>
  );
}
