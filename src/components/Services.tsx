import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  MegaphoneSimple, 
  TrendUp, 
  ChatCircle, 
  ArrowRight 
} from '@phosphor-icons/react';

gsap.registerPlugin(ScrollTrigger);

const Services: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;

    if (!section || !cards) return;

    // Title animation
    gsap.from('.services-title', {
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

    // Cards animation
    gsap.from(cards.children, {
      scrollTrigger: {
        trigger: cards,
        start: 'top 80%',
      },
      y: 100,
      opacity: 0,
      scale: 0.9,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out'
    });

    // Horizontal scroll for mobile
    const handleResize = () => {
      if (window.innerWidth < 768) {
        gsap.set(cards, {
          x: 0,
          scrollTrigger: {
            trigger: cards,
            start: 'left right',
            end: 'right left',
            scrub: 1,
            horizontal: true
          }
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const services = [
    {
      icon: MegaphoneSimple,
      title: 'AI Ads',
      description: 'Meta ads are run and optimized with help of AI and our ad experts for maximum ROI.',
      image: '/images/project-1.jpeg',
      color: 'from-blue-500 to-cyan-500',
      glowColor: 'glow-blue'
    },
    {
      icon: TrendUp,
      title: 'AI Rank',
      description: 'SEO and ranking optimization done with help of AI and our SEO experts.',
      image: '/images/project-2.jpeg',
      color: 'from-purple-500 to-pink-500',
      glowColor: 'glow-purple'
    },
    {
      icon: ChatCircle,
      title: 'AI Chat',
      description: 'WhatsApp chatbot built with help of AI and our experts to get qualified leads.',
      image: '/images/project-3.jpeg',
      color: 'from-green-500 to-teal-500',
      glowColor: 'glow-cyan'
    }
  ];

  return (
    <section 
      id="services" 
      ref={sectionRef}
      className="py-20 px-4 max-w-7xl mx-auto"
    >
      <div className="text-center mb-16">
        <h2 className="services-title text-5xl font-bold gradient-text mb-4">
          Our Services
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Cutting-edge AI solutions tailored for your digital marketing success
        </p>
      </div>

      <div 
        ref={cardsRef}
        className="flex gap-8 overflow-x-auto md:overflow-visible md:grid md:grid-cols-3 pb-4"
      >
        {services.map((service, index) => (
          <div 
            key={index}
            className="flex-shrink-0 w-80 md:w-auto glass rounded-2xl p-6 card-hover group relative overflow-hidden"
          >
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            {/* Content */}
            <div className="relative z-10">
              {/* Icon */}
              <div className={`w-16 h-16 ${service.glowColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon size={32} className="text-white" />
              </div>

              {/* Project Image */}
              <div className="mb-6 rounded-lg overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-4">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-gray-300 mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* CTA */}
              <button className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-300 group/btn">
                <span>Learn More</span>
                <ArrowRight 
                  size={16} 
                  className="group-hover/btn:translate-x-1 transition-transform duration-300" 
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;