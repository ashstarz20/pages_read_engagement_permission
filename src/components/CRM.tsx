import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Database, 
  ChartLine, 
  Users, 
  Gear, 
  Lightning, 
  Shield,
  ArrowRight 
} from '@phosphor-icons/react';

gsap.registerPlugin(ScrollTrigger);

const CRM: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;

    if (!section || !cards) return;

    // Title animation
    gsap.from('.crm-title', {
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

    // Floating elements animation
    gsap.to('.float-element', {
      y: -15,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      stagger: 0.3
    });
  }, []);

  const crmFeatures = [
    {
      icon: Database,
      title: 'Smart Data Management',
      description: 'AI-powered customer data organization and insights',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: ChartLine,
      title: 'Predictive Analytics',
      description: 'Forecast customer behavior and sales trends',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Lead Scoring',
      description: 'Automatically prioritize high-value prospects',
      color: 'from-green-500 to-teal-500'
    }
  ];

  const appFeatures = [
    {
      icon: Lightning,
      title: 'Real-time Automation',
      description: 'Instant campaign optimization and adjustments',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Shield,
      title: 'Secure Integration',
      description: 'Enterprise-grade security for all your data',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Gear,
      title: 'Custom Workflows',
      description: 'Tailored automation for your business needs',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  return (
    <section 
      id="crm" 
      ref={sectionRef}
      className="py-20 px-4 max-w-7xl mx-auto relative"
    >
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="float-element absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-xl"></div>
        <div className="float-element absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-xl"></div>
        <div className="float-element absolute bottom-32 left-32 w-40 h-40 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-xl"></div>
      </div>

      <div className="text-center mb-16 relative z-10">
        <h2 className="crm-title text-5xl font-bold gradient-text mb-4">
          STARZ AI Solutions
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Powerful AI-driven CRM and mobile app solutions designed to transform your business operations
        </p>
      </div>

      <div className="space-y-20">
        {/* STARZ AI CRM */}
        <div className="relative">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-white mb-4">STARZ AI CRM</h3>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Revolutionary customer relationship management powered by artificial intelligence
            </p>
          </div>

          <div ref={cardsRef} className="grid md:grid-cols-3 gap-8">
            {crmFeatures.map((feature, index) => (
              <div 
                key={index}
                className="glass rounded-2xl p-8 card-hover group relative overflow-hidden"
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon size={32} className="text-white" />
                  </div>
                  
                  <h4 className="text-xl font-bold text-white mb-4">
                    {feature.title}
                  </h4>
                  
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* STARZ AI App */}
        <div className="relative">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-white mb-4">STARZ AI App</h3>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Mobile-first AI marketing platform for on-the-go campaign management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {appFeatures.map((feature, index) => (
              <div 
                key={index}
                className="glass rounded-2xl p-8 card-hover group relative overflow-hidden"
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon size={32} className="text-white" />
                  </div>
                  
                  <h4 className="text-xl font-bold text-white mb-4">
                    {feature.title}
                  </h4>
                  
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <button className="btn-glow text-lg px-8 py-4 rounded-full inline-flex items-center gap-3 group">
            <span>Get Started Today</span>
            <ArrowRight 
              size={20} 
              className="group-hover:translate-x-1 transition-transform duration-300" 
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CRM;