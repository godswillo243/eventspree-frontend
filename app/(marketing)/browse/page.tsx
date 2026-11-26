import BrowseSidebar from "../_components/browse-sidebar";

const BrowsePage = () => {
  return (
    <div className="px-6 w-full relative">
      <div className="w-full flex items-center justify-center">
        <div className="flex">
          <div className="" role="button">
            Vendors
          </div>

          <div className="" role="button">
            Venues
          </div>
        </div>
      </div>
      <div>
        <BrowseSidebar />
      </div>
    </div>
  );
};

export default BrowsePage;
