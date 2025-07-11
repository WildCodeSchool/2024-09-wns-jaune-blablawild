import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";

type LayoutProps = {
  children: ReactNode;
  showFooter?: boolean;
};

const Layout = ({ children, showFooter = true }: LayoutProps) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;