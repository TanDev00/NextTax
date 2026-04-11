import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Standard Fade In animation
 */
export function fadeIn(el: string | HTMLElement, delay: number = 0, y: number = 30) {
  return gsap.fromTo(el,
    { opacity: 0, y: y },
    { 
      opacity: 1, 
      y: 0, 
      duration: 1, 
      delay: delay, 
      ease: "power2.out",
      scrollTrigger: typeof el === 'string' ? {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      } : undefined
    }
  );
}

/**
 * Stagger Reveal for multiple elements
 */
export function staggerReveal(elements: string | HTMLElement[], stagger: number = 0.1, delay: number = 0) {
  return gsap.fromTo(elements,
    { opacity: 0, y: 40, scale: 0.95 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      stagger: stagger,
      delay: delay,
      ease: "power3.out",
      scrollTrigger: typeof elements === 'string' ? {
        trigger: elements,
        start: 'top 85%',
        toggleActions: 'play none none none'
      } : undefined
    }
  );
}

/**
 * Clip path reveal for images/blocks
 */
export function clipPathReveal(el: string | HTMLElement, delay: number = 0) {
  return gsap.fromTo(el,
    { opacity: 0, clipPath: 'inset(0 0 100% 0)' },
    { 
      opacity: 1, 
      clipPath: 'inset(0 0 0% 0)', 
      duration: 1.2, 
      delay: delay, 
      ease: "power3.inOut",
      scrollTrigger: typeof el === 'string' ? {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none none'
      } : undefined
    }
  );
}
