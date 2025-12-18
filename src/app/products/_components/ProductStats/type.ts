export interface IStartProps {
  averageRating?: number | string;
  totalReviews?: number;
  soldCount?: number | string; // Cho phép cả string và number
  formatCompactNumber?: (value: number | string) => string;
  className?: string;
}