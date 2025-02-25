import MemeGeneratorX from "@/components/meme-generator";
import ProfileCard from "@/components/composed/profile-card";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getAddress } from "@chopinframework/next";

export default async function Home() {
  const queryClient = new QueryClient();
  const address = await getAddress();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {address && <ProfileCard userAddress={address} />}
      <MemeGeneratorX />
    </HydrationBoundary>
  );
}
