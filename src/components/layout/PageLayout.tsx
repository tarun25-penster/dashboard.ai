
import { Header } from "@/components/layout/header";
import { ThemeSwitch } from "@/components/theme-switch";
import { ProfileDropdown } from "@/components/profile-dropdown";

export default function PageLayout({title, children}) {
  return (
    <>
      <Header fixed>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <div className="p-6 mt-16">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <div className="bg-white p-4 rounded-lg shadow-md">{children}</div>
      </div>
    </>
  );
}
