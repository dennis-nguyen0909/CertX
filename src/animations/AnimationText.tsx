import { motion } from "framer-motion";

const AnimatedText = ({
  text,
  delay = 0,
}: {
  text: string;
  delay?: number;
}) => {
  return (
    <>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
            delay: delay + index * 0.1,
          }}
        >
          {char}
        </motion.span>
      ))}
    </>
  );
};

export default AnimatedText;
