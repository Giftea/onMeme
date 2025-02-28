import ProfileLayout from "@/components/layout/profile";
import { generateMetadata as Meta } from "@/lib/utils/metadata.utils";
import { memeRouter } from "@/server/routes/memes";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: number }>;
}

type Props = {
  params: Promise<{ id: number }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;

  const caller = memeRouter.createCaller({});

  const memeData = await caller.getMemeByID({ id: Number(id) });

  const profileUrl = `https://on-meme.vercel.app/user/${
    memeData.ownerAddress
  }/${Number(id)}`;

  return Meta({
    title: `onMeme - ${memeData.ownerAddress} Profile`,
    description: `View my generated Meme on onMeme`,
    metaProfile: {
      name: memeData.ownerAddress,
      url: profileUrl,
      description: "View my Meme",
      image: memeData.imageUrl,
    },
  });
}

export default async function Page({ params }: PageProps) {
  const id = (await params).id;

  const caller = memeRouter.createCaller({});

  const memeData = await caller.getMemeByID({ id: Number(id) });

  return (
    <ProfileLayout
      meme={memeData}
      address={memeData.ownerAddress}
      isProfilePage={false}
      isUserPublicPage={true}
    />
  );
}
