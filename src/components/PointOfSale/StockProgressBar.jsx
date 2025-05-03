import React from "react";
import { Progress, Typography } from "@material-tailwind/react";

const StockProgressBar = ({ stock, threshold }) => {
  const percentage = (stock / threshold) * 100;
  let color;
  if (stock >= threshold * 1.3) color = "black";
  else if (stock >= threshold) color = "orange";
  else color = "red";

  return (
    <div className="mt-1">
      <Progress
        value={Math.min(percentage, 100)}
        color={color}
        className="mt-1 h-2"
      />
      <div className="flex justify-between text-xs text-gray-600 mt-1">
        <span>Stock: {stock}</span>
        <span>Threshold: {threshold}</span>
      </div>
    </div>
  );
};

export default StockProgressBar