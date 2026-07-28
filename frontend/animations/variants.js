import { EASE, DURATION } from "@/constants/animationConfig";

export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE.luxury },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.slow, ease: EASE.luxury },
  },
};

export const staggerContainer = (staggerChildren = 0.12, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren, delayChildren },
  },
});

export const scaleReveal = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.base, ease: EASE.luxury },
  },
};

export const textReveal = {
  hidden: { opacity: 0, y: "100%" },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE.luxury },
  },
};

export const imageZoomHover = {
  rest: { scale: 1 },
  hover: {
    scale: 1.06,
    transition: { duration: DURATION.slow, ease: EASE.luxury },
  },
};

export const navReveal = {
  top: { backgroundColor: "rgba(10,10,11,0)", borderColor: "rgba(201,167,104,0)" },
  scrolled: {
    backgroundColor: "rgba(10,10,11,0.72)",
    borderColor: "rgba(201,167,104,0.14)",
    transition: { duration: DURATION.fast, ease: EASE.standard },
  },
};
