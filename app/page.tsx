import Text from "@/components/Text";
import { getAddress } from "@/lib/chopin-server";

export default async function Home() {
  const address = await getAddress();

  return (
    <div>
      <Text initialAddress={address} />
    </div>
  );
}
