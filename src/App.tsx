import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { ProductList } from "./features/products/ProductList";
import { ProductDetails } from "./features/products/ProductDetails";
import AddCart from "./features/products/AddCart";

export default function App() {
  return (
    <div className="">
      <main>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetails />} />

        </Routes>
      </main>
    </div>
  );
}
