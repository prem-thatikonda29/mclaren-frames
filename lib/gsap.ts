import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Register all GSAP plugins in one place
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Disable lag smoothing for Lenis integration
gsap.ticker.lagSmoothing(0);

export { gsap };
export { ScrollTrigger };
export { ScrollToPlugin };