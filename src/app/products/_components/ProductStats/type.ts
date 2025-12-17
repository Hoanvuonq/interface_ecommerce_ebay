export interface IStartProps {
  averageRating?: number | null;
  totalReviews?: number | null;
  soldCount?: number | null;
  formatCompactNumber: (value?: number | null) => string | number | null;
  className?: string;
}
