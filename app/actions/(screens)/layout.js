import NavigateBack from "@/components/NavigateBack";
import "@/app/globals.css";

export default function ScreensLayout({ children }) {
  return (
    <>
      <NavigateBack />
      <main className="app-container">{children}</main>
    </>
  );
}
