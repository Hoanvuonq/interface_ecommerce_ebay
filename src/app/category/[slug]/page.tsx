"use client";
import React from "react";
import CategoryScreen from "./_pages";

interface CategoryProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{
    page?: string;
    size?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    showMore?: string;
  }>;
}

const Category: React.FC<CategoryProps> = ({ params, searchParams }) => {
  return <CategoryScreen params={params} searchParams={searchParams} />;
};

export default Category;
