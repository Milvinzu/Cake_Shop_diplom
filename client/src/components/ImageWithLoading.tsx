import React, { useState } from "react";
import { motion } from "framer-motion";
import LoadingCube from "./LoadingCube";

interface ImageWithLoadingProps {
  src: string;
  alt: string;
}

const ImageWithLoading: React.FC<ImageWithLoadingProps> = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div>
      {!loaded && <LoadingCube />}
      <motion.img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
};

export default ImageWithLoading;
