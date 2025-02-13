import MemeGenerator from "@/components/meme-generation";
import ProfileCard from "@/components/profile/ProfileCard";
import TopMemes from "@/components/TopMemes";
import TopTemplates from "@/components/TopTemplates";
import { getAddress } from "@/lib/chopin-server";

export default async function Home() {
  const address = await getAddress();

  return (
    <main>
      <ProfileCard initialAddress={address} />
      <MemeGenerator />
      <TopTemplates />
      <TopMemes />
    </main>
  );
}
