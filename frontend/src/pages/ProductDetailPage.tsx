import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Minus, ShoppingCart } from "lucide-react";
import { productService } from "../services/api";
import { useCart } from "../hooks/useCart";
import LoadingSpinner from "../components/LoadingSpinner";
import type { Product } from "../types";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const productData = await productService.getProduct(id);
        setProduct(productData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch product"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setAddingToCart(true);
    try {
      addToCart(product, quantity);
      // Show success message or toast here
      alert(`Added ${quantity} ${quantity === 1 ? "item" : "items"} to cart!`);
    } catch (err) {
      alert("Failed to add item to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">
            {error || "Product not found"}
          </p>
          <button
            onClick={() => navigate("/products")}
            className="text-blue-600 hover:text-blue-800">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="aspect-w-1 aspect-h-1 bg-gray-200">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-96 lg:h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://via.placeholder.com/600x600?text=No+Image";
                }}
              />
            </div>

            {/* Product Details */}
            <div className="p-6 lg:p-8">
              <div className="mb-4">
                <span className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                {product.description}
              </p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-blue-600">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-medium">Stock:</span>
                  <span
                    className={`text-lg font-semibold ${
                      product.stock > 0 ? "text-green-600" : "text-red-600"
                    }`}>
                    {product.stock > 0
                      ? `${product.stock} available`
                      : "Out of stock"}
                  </span>
                </div>

                {product.stock > 0 && (
                  <div className="flex items-center space-x-4 mb-6">
                    <span className="text-lg font-medium">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 font-medium">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stock}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {product.stock > 0 ? (
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  <ShoppingCart className="h-5 w-5" />
                  <span>{addingToCart ? "Adding..." : "Add to Cart"}</span>
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold text-lg cursor-not-allowed">
                  Out of Stock
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
