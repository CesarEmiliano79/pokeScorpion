// hooks/usePagination.ts
import { useState } from "react";

export function usePagination(initialPage = 1) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const goToPage = (page, totalPages) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const nextPage = (totalPages) => goToPage(currentPage + 1, totalPages);
  const prevPage = () => goToPage(currentPage - 1, Infinity);

  return { currentPage, setCurrentPage, nextPage, prevPage, goToPage };
}
