import Banner from "./_components/banner";
import BrowseCategories from "./_components/browse-categories";
import Heading from "./_components/heading";
import HowItWorks from "./_components/how-it-works";

export default function LandingPage() {
  return (
    <div className="min-h-full flex flex-col ">
      <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8  flex-1 px-6 pb-10">
        <Heading />
        <BrowseCategories />
        <HowItWorks />
      </div>
      <Banner />
    </div>
  );
}
