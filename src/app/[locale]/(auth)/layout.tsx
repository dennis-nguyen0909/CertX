// import Providers from "../../providers";
import { HeaderLocaleSwitcher } from "@/components/header-locale-switcher";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex justify-end pr-4 pt-4">
        <HeaderLocaleSwitcher />
      </div>
      {children}
    </div>
  );
}
