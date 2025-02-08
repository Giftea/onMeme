import Header from "@/components/layout/Header";
import ProfileCard from "@/components/profile/ProfileCard";
import { getAddress } from "@/lib/chopin-server";

export default async function Home() {
  const address = await getAddress();

  return (
    <main className="">
      <Header />
      <ProfileCard initialAddress={address}  />
    </main>
  );
}
