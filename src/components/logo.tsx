import Image from "next/image";
import logo from "../../public/brand/youcon-logo.png";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src={logo}
      alt="YouCon"
      priority
      sizes="200px"
      className={className}
    />
  );
}
