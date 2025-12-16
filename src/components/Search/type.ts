export interface ISearch {
  searchValue: string;
  searchOptions?: Array<
    | string
    | {
        value: string;
        label?: React.ReactNode; 
        [key: string]: any;     
      }
  >;
  onChange: (value: string) => void;
  onSelect?: (value: string, option: any) => void;
  onSubmit: (value?: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  compact?: boolean;
  ctaColor?: string;
}