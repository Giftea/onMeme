import MemeGeneratorX from "@/components/meme-generator";
import ProfileCard from "@/components/profile/ProfileCard";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getAddress } from "@chopinframework/next";

export default async function Home() {
  const address = await getAddress();
  const queryClient = new QueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileCard userAddress={address} />
      <MemeGeneratorX address={address} />
    </HydrationBoundary>
  );
}
