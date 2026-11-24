const categories = ["Catering", "Photography", "Decor", "Dj", "Dancers"];

const BrowseCategories = () => {
  return (
    <div className="w-full flex flex-col gap-6 border-t border-b border-neutral-200 py-6">
      <h3 className="heading-2">Browse by Category</h3>
      <div className="flex items-center justify-center flex-wrap gap-4">
        {categories.map((c) => (
          <div
            key={c}
            className="text-body font-medium px-4 py-2 rounded-md bg-neutral-100 hover:bg-neutral-200 cursor-pointer"
          >
            {c}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowseCategories;
