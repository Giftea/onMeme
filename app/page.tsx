import MemeGenerator from "@/components/meme-generation";
import ProfileCard from "@/components/profile/ProfileCard";
import TopMemes from "@/components/TopMemes";
import TopTemplates from "@/components/TopTemplates";
import { getAddress } from "@/lib/chopin-server";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

export default async function Home() {
  const address = await getAddress();
  const queryClient = new QueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileCard initialAddress={address} />
      <MemeGenerator />
      <TopTemplates />
      <TopMemes />
    </HydrationBoundary>
  );
}
