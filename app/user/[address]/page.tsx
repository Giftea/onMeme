import ProfileLayout from "@/components/layout/profile";
import { generateMetadata as Meta } from "@/lib/utils/metadata.utils";
import { userRouter } from "@/server/routes/user";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ address: number }>;
}

type Props = {
  params: Promise<{ address: number }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const address = (await params).address;

  const caller = userRouter.createCaller({});

  const userData = await caller.fetchUser({
    address: String(address),
    initAccount: true,
  });

  const profileUrl = `https://on-meme.vercel.app/user/${address}`;

  return Meta({
    title: `${userData.username ?? userData.address} - onMeme Profile`,
    description: `View my onMeme profile`,
    metaProfile: {
      name: userData.address,
      url: profileUrl,
      description: "View my onMeme profile",
      image: userData.avatar,
    },
  });
}

export default async function Page({ params }: PageProps) {
  const address = (await params).address;

  const caller = userRouter.createCaller({});

  const userData = await caller.fetchUser({
    address: String(address),
    initAccount: true,
  });
  return <ProfileLayout address={userData.address} />;
}
