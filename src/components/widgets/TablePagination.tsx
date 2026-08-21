import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (size: number) => void;
  itemsPerPageOptions?: number[];
  itemName?: string;
}

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 20, 50, 100],
  itemName = "data"
}: TablePaginationProps) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  const [inputPage, setInputPage] = useState(currentPage.toString());

  useEffect(() => {
    setInputPage(currentPage.toString());
  }, [currentPage]);

  const handleInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const page = parseInt(inputPage);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        onPageChange(page);
      } else {
        setInputPage(currentPage.toString());
      }
    }
  };

  const handleInputBlur = () => {
    const page = parseInt(inputPage);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
    } else {
      setInputPage(currentPage.toString());
    }
  };

  const getVisiblePages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, "...", totalPages];
    if (currentPage >= totalPages - 2) return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col xl:flex-row items-center justify-between px-6 py-4 border-t border-slate-200 bg-white gap-4">
      <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-slate-500 w-full xl:w-auto justify-between xl:justify-start">
        <div className="whitespace-nowrap">
          Menampilkan {startIndex + 1} - {Math.min(endIndex, totalItems)} dari {totalItems} {itemName}
        </div>
        {onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap">Tampilkan:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                onItemsPerPageChange(parseInt(e.target.value));
                onPageChange(1);
              }}
              className="border border-slate-200 rounded-md text-sm px-2 py-1 focus:outline-none focus:border-[#0a4d8c]"
            >
              {itemsPerPageOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 xl:gap-4 w-full xl:w-auto">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Sebelumnya</span>
          </button>
          
          <div className="flex items-center gap-1">
            {getVisiblePages().map((page, idx) => 
              page === "..." ? (
                <span key={`dots-${idx}`} className="px-1 text-slate-400">...</span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange(page as number)}
                  className={`min-w-[35px] py-2 px-2 rounded-xl text-sm font-medium transition-colors border ${
                    currentPage === page 
                      ? 'bg-[#0a4d8c] text-white border-[#0a4d8c]' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>
          
          <button
            onClick={() => onPageChange(Math.max(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            <span className="hidden sm:inline">Selanjutnya</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
          <span className="text-sm text-slate-500 whitespace-nowrap">Ke hal:</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputPage}
            onChange={(e) => setInputPage(e.target.value.replace(/[^0-9]/g, ''))}
            onKeyDown={handleInputSubmit}
            onBlur={handleInputBlur}
            className="w-[50px] h-9 text-center px-1 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0a4d8c]"
          />
        </div>
      </div>
    </div>
  );
}
