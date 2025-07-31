import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  House, 
  GraduationCap, 
  Heart, 
  Shield, 
  ShoppingCart 
} from '@phosphor-icons/react';

gsap.registerPlugin(ScrollTrigger);

const Industries: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;

    if (!section || !cards) return;

    // Title animation
    gsap.from('.industries-title', {
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
      },
      y: 50,
      opacity: 0,
      filter: 'blur(10px)',
      duration: 1,
      ease: 'power2.out'
    });

    // Horizontal scroll animation
    const cardElements = cards.children;
    
    gsap.set(cardElements, { x: 100, opacity: 0 });
    
    gsap.to(cardElements, {
      scrollTrigger: {
        trigger: cards,
        start: 'left 80%',
        end: 'right 20%',
        scrub: 1,
      },
      x: 0,
      opacity: 1,
      stagger: 0.2,
      ease: 'power2.out'
    });

    // Individual card hover animations
    Array.from(cardElements).forEach((card) => {
      const cardElement = card as HTMLElement;
      
      cardElement.addEventListener('mouseenter', () => {
        gsap.to(cardElement, {
          scale: 1.05,
          y: -10,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      cardElement.addEventListener('mouseleave', () => {
        gsap.to(cardElement, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });
  }, []);

  const industries = [
    {
      icon: House,
      title: 'Real Estate',
      description: 'AI-powered lead generation and property marketing solutions for real estate professionals.',
      gradient: 'from-blue-500 to-cyan-500',
      planet: 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: GraduationCap,
      title: 'Education',
      description: 'Smart marketing strategies for educational institutions and online learning platforms.',
      gradient: 'from-purple-500 to-pink-500',
      planet: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Targeted campaigns for healthcare providers and wellness brands.',
      gradient: 'from-green-500 to-teal-500',
      planet: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Shield,
      title: 'Insurance',
      description: 'Data-driven marketing solutions for insurance companies and brokers.',
      gradient: 'from-orange-500 to-red-500',
      planet: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: ShoppingCart,
      title: 'E-commerce',
      description: 'Conversion optimization and customer acquisition for online retailers.',
      gradient: 'from-indigo-500 to-purple-500',
      planet: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  return (
    <section 
      id="industries" 
      ref={sectionRef}
      className="py-20 px-4 overflow-hidden"
    >
      <div className="text-center mb-16">
        <h2 className="industries-title text-5xl font-bold gradient-text mb-4">
          Industries We Serve
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Specialized AI marketing solutions across diverse industry verticals
        </p>
      </div>

      <div 
        ref={cardsRef}
        className="flex gap-8 overflow-x-auto pb-4"
        style={{ width: 'max-content' }}
      >
        {industries.map((industry, index) => (
          <div 
            key={index}
            className="flex-shrink-0 w-80 glass rounded-2xl overflow-hidden relative group"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img 
                src={industry.planet} 
                alt={industry.title}
                className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${industry.gradient} opacity-20`}></div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-8 h-full flex flex-col">
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${industry.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <industry.icon size={32} className="text-white" />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-4">
                {industry.title}
              </h3>

              {/* Description */}
              <p className="text-gray-300 leading-relaxed flex-grow">
                {industry.description}
              </p>

              {/* Glow effect on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${industry.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Industries;