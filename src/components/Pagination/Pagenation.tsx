import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import style from "./Pagination.module.css";

type PagenationProp = {
  handleFirstPage: () => void;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  handleLastPage: () => void;
  page: number;
  totalPages: number;
};

export default function Pagination({
  handleFirstPage,
  handlePrevPage,
  handleNextPage,
  handleLastPage,
  page,
  totalPages,
}: PagenationProp) {
  return (
    <div className={style.pagination}>
      <button
        className={style.paginationSkipButton}
        onClick={handleFirstPage}
        disabled={page === 1}
        type="button"
      >
        <KeyboardDoubleArrowLeftIcon />
      </button>
      <button
        className={style.paginationButton}
        onClick={handlePrevPage}
        disabled={page === 1}
        type="button"
      >
        前へ
      </button>
      <span className={style.pageNum}>
        Page {page} of {totalPages}
      </span>
      <button
        className={style.paginationButton}
        onClick={handleNextPage}
        disabled={page === totalPages}
        type="button"
      >
        次へ
      </button>
      <button
        className={style.paginationSkipButton}
        onClick={handleLastPage}
        disabled={page === totalPages}
        type="button"
      >
        <KeyboardDoubleArrowRightIcon />
      </button>
    </div>
  );
}
