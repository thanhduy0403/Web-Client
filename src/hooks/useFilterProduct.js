export const useFilterProduct = (
  products = [],
  search = "",
  selectFilter = "",
  selectCate = ""
) => {
  if (!Array.isArray(products)) return [];
  return [...products]
    .filter((item) => {
      const matchName = item.name.toLowerCase().includes(search.toLowerCase());
      const matchCate =
        !selectCate || (item.categoryID && item.categoryID._id === selectCate);

      return matchName && matchCate;
    })
    .sort((a, b) => {
      if (selectFilter === "Mới nhất") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (selectFilter === "Cũ nhất") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (selectFilter === "Bán chạy") {
        return b.soldCount - a.soldCount;
      } else if (selectFilter === "Giá tăng dần") {
        return a.discountedPrice - b.discountedPrice || b.price - a.price;
      } else if (selectFilter === "Giá giảm dần") {
        return b.discountedPrice - a.discountedPrice || a.price - b.price;
      } else if (selectFilter === "all") {
        return 0;
      }
    });
};
