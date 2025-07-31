import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight } from '@phosphor-icons/react';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const splineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 4 }); // After preloader

    // Hero animations
    tl.from(titleRef.current, {
      y: 50,
      opacity: 0,
      filter: 'blur(10px)',
      duration: 1.2,
      ease: 'power2.out'
    })
    .from(subtitleRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.6')
    .from(ctaRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)'
    }, '-=0.4')
    .from(splineRef.current, {
      x: 100,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    }, '-=0.8');

    // Floating orbs animation
    gsap.to('.glow-orb', {
      y: -20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      stagger: 0.5
    });

    // CTA button hover animation
    const ctaButton = ctaRef.current;
    if (ctaButton) {
      ctaButton.addEventListener('mouseenter', () => {
        gsap.to(ctaButton, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      ctaButton.addEventListener('mouseleave', () => {
        gsap.to(ctaButton, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    }
  }, []);

  return (
    <section id="home" ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Spline 3D */}
      <div ref={splineRef} className="absolute inset-0 z-0">
        <iframe 
          src='https://my.spline.design/worldplanet-gksiB3B7hTK3BQpvoDotrgKZ/' 
          frameBorder='0' 
          width='100%' 
          height='100%'
          className="w-full h-full"
        />
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 z-10">
        <div className="glow-orb absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
        <div className="glow-orb absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl"></div>
        <div className="glow-orb absolute bottom-32 left-40 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl"></div>
        <div className="glow-orb absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        <h1 
          ref={titleRef}
          className="text-6xl md:text-8xl font-bold mb-6 gradient-text leading-tight"
        >
          Welcome To STARZ
        </h1>
        
        <p 
          ref={subtitleRef}
          className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          Revolutionizing Digital Marketing with AI-Powered Solutions
        </p>
        
        <button 
          ref={ctaRef}
          className="btn-glow text-lg px-8 py-4 rounded-full inline-flex items-center gap-3 group"
        >
          <span className="glow-text">Explore</span>
          <ArrowRight 
            size={20} 
            className="group-hover:translate-x-1 transition-transform duration-300" 
          />
        </button>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 z-10"></div>
    </section>
  );
};

export default Hero;