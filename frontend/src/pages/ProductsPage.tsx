import React, { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { productService } from "../services/api";
import type { Product } from "../types";

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    "Electronics",
    "Clothing",
    "Books",
    "Home",
    "Sports",
    "Beauty",
  ];

  const fetchProducts = async (page: number = 1) => {
    try {
      setLoading(true);
      const params: any = { page, limit: 12 };

      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;

      const response = await productService.getProducts(params);
      setProducts(response.products);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts(1);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory]);

  const handlePageChange = (page: number) => {
    fetchProducts(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Our Products
          </h1>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white">
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found.</p>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                }}
                className="mt-4 text-blue-600 hover:text-blue-800">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 border rounded-md text-sm font-medium ${
                          page === currentPage
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300 text-gray-500 hover:text-gray-700"
                        }`}>
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
