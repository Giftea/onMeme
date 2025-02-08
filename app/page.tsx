import Header from "@/components/layout/header";
import Text from "@/components/Text";
import { getAddress } from "@/lib/chopin-server";

export default async function Home() {
  const address = await getAddress();

  return (
    <main className="">
      <Header />
      <Text initialAddress={address} />
    </main>
  );
}
