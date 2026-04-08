import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AnimatedCard = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, rotateX: -15 }}
      animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.8, delay, type: "spring", stiffness: 80, damping: 15 }}
      style={{ transformStyle: "preserve-3d", perspective: 1500 }}
      whileHover={{ scale: 1.01, rotateY: 1, rotateX: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;