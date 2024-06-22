import { motion } from "framer-motion";
import "../scss/components/_loadingProducts.scss";

const LoadingProducts: React.FC = () => {
  return (
    <div className="loading-products">
      {Array(10)
        .fill(0)
        .map((_, i) => (
          <motion.div
            key={i}
            className="loading-product"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{
              repeat: Infinity,
              ease: "easeInOut",
              duration: 0.5,
            }}
          />
        ))}
    </div>
  );
};

export default LoadingProducts;
