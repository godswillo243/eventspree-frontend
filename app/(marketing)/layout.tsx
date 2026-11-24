import { MARKETING_NAVBAR_HEIGHT } from "@/lib/constants";
import Footer from "./_components/footer";
import Navbar from "./_components/navbar";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full w-full">
      <Navbar />
      <main
        className="w-full h-full "
        style={{
          paddingTop: MARKETING_NAVBAR_HEIGHT + "px",
        }}
      >
        {children}

        <Footer />
      </main>
    </div>
  );
};

export default MarketingLayout;
