import { motion } from "framer-motion";

const Loader: React.FC = () => {
  return (
    <motion.div
      style={{
        border: "4px solid #f0bc56",
        borderRadius: "50%",
        borderTop: "4px solid #38302a",
        width: "60px",
        height: "60px",
      }}
      animate={{ rotate: 360 }}
      transition={{
        loop: Infinity,
        ease: "linear",
        duration: 1,
      }}
    />
  );
};

export default Loader;
