import MemeGeneratorX from "@/components/meme-generator";
import ProfileCard from "@/components/profile/ProfileCard";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

export default async function Home() {
  const queryClient = new QueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileCard />
      <MemeGeneratorX />
    </HydrationBoundary>
  );
}
