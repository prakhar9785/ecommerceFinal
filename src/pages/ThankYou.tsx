import React from "react";

const ThankYou: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="bg-white p-8 rounded-lg shadow text-center">
      <h1 className="text-3xl font-bold mb-4 text-green-600">Thank you for placing your order!</h1>
      <p className="text-gray-700">We appreciate your purchase.</p>
    </div>
  </div>
);

export default ThankYou;