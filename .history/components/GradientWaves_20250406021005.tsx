// GradientWaves.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const GradientWaves = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true); // This could be used to trigger animations when the component is mounted
  }, []);

  return (
    <motion.div
      className="gradient-waves"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="waves-container">
        {/* Your wave/gradient animation logic here */}
      </div>
    </motion.div>
  );
};

export default GradientWaves;
npm 