import React from "react";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";

const CartPage: React.FC = () => {
  const { state, removeFromCart, updateQuantity, clearCart } = useCart();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Start shopping to add items to your cart
          </p>
          <Link
            to="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-800 font-medium">
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="divide-y divide-gray-200">
                {state.items.map((item) => (
                  <div key={item.product._id} className="p-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "https://via.placeholder.com/80x80?text=No+Image";
                        }}
                      />

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.product.name}
                        </h3>
                        <p className="text-gray-600">{item.product.category}</p>
                        <p className="text-lg font-bold text-blue-600">
                          ${item.product.price.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product._id,
                                item.quantity - 1
                              )
                            }
                            className="p-2 hover:bg-gray-100">
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product._id,
                                item.quantity + 1
                              )
                            }
                            disabled={item.quantity >= item.product.stock}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          className="text-red-600 hover:text-red-800 p-2">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {item.product.stock > 0
                          ? `${item.product.stock} in stock`
                          : "Out of stock"}
                      </span>
                      <span className="text-lg font-semibold">
                        Subtotal: $
                        {(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>
                    Items (
                    {state.items.reduce((acc, item) => acc + item.quantity, 0)}
                    ):
                  </span>
                  <span>${state.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${(state.total * 0.08).toFixed(2)}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>${(state.total * 1.08).toFixed(2)}</span>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-3">
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-center block">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
