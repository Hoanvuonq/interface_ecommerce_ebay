export interface CategorySummaryResponse {
    id: string;
    name: string;
    slug: string;
    active: boolean;
    parentId?: string;
    imageBasePath?: string;
    imageExtension?: string;
    children?: CategorySummaryResponse[];
}
