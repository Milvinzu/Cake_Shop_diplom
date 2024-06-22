import { motion } from "framer-motion";

const LoadingCube: React.FC = () => {
  return (
    <motion.div
      style={{
        width: "100px",
        height: "100px",
        borderRadius: "20px",
        backgroundColor: "#e6e4e7",
      }}
      animate={{ opacity: [1, 0, 1] }}
      transition={{
        repeat: Infinity,
        ease: "easeInOut",
        duration: 1,
      }}
    />
  );
};

export default LoadingCube;
