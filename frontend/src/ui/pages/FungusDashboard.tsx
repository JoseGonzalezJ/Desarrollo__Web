import React from "react";
import FungusPage from "../components/FungusForm";

const FungusDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Hongos</h1>
      <FungusPage />
    </div>
  );
};

export default FungusDashboard;
