import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  const { theme } = useTheme();

  return (
    <Link href={"/"} className="w-36">
      {theme === "dark" && (
        <Image
          src="/images/logo.svg"
          alt="Logo"
          className="w-28 md:w-36"
          width={140}
          height={140}
        />
      )}{" "}
      {theme === "light" && (
        <Image
          src="/images/logo-dark.svg"
          alt="Logo"
          className="w-28 md:w-36"
          width={140}
          height={140}
        />
      )}
    </Link>
  );
}
