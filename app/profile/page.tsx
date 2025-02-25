import ProfileCard from "@/components/profile/ProfileCard";
import User from "@/components/profile";

export default async function Home() {

  return (
    <div>
      <ProfileCard isProfilePage />
      <User />
    </div>
  );
}
