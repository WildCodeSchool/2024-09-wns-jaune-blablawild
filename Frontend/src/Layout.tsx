import { ReactNode } from "react";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";

type LayoutProps = {
  children: ReactNode;
  showFooter?: boolean;
};

const Layout = ({ children, showFooter = true }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
