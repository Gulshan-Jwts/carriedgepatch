import Titlebar from "@/components/Titlebar";
import BottomNav from "@/components/BottomNav";
import "@/app/globals.css";

export default function TabsLayout({ children }) {
  return (
    <>
      <Titlebar />
      <main className="app-container">{children}</main>
      <BottomNav />
    </>
  );
}
