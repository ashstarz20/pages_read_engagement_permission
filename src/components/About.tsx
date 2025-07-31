import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Code, 
  Palette, 
  Rocket, 
  Brain, 
  Target, 
  TrendUp 
} from '@phosphor-icons/react';

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const content = contentRef.current;
    const skills = skillsRef.current;

    if (!section || !image || !content || !skills) return;

    // Main animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    });

    tl.from(image, {
      x: -100,
      opacity: 0,
      filter: 'blur(10px)',
      duration: 1,
      ease: 'power2.out'
    })
    .from(content.children, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out'
    }, '-=0.5')
    .from(skills.children, {
      scale: 0.8,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'back.out(1.7)'
    }, '-=0.4');

    // Image hover animation
    image.addEventListener('mouseenter', () => {
      gsap.to(image, {
        scale: 1.05,
        rotationY: 5,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    image.addEventListener('mouseleave', () => {
      gsap.to(image, {
        scale: 1,
        rotationY: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  }, []);

  const skills = [
    { icon: Brain, name: 'AI Marketing', color: 'text-blue-400' },
    { icon: Target, name: 'Targeted Ads', color: 'text-purple-400' },
    { icon: TrendUp, name: 'SEO Optimization', color: 'text-cyan-400' },
    { icon: Code, name: 'Automation', color: 'text-green-400' },
    { icon: Palette, name: 'Creative Design', color: 'text-pink-400' },
    { icon: Rocket, name: 'Growth Hacking', color: 'text-orange-400' }
  ];

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="py-20 px-4 max-w-7xl mx-auto"
    >
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Profile Image */}
        <div ref={imageRef} className="relative">
          <div className="relative w-80 h-80 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-30"></div>
            <div className="relative glass rounded-full p-4 glow-blue">
              <img 
                src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="STARZ Ai Team" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div ref={contentRef} className="space-y-6">
          <h2 className="text-5xl font-bold gradient-text">About STARZ Ai</h2>
          
          <p className="text-lg text-gray-300 leading-relaxed">
            We are pioneers in AI-driven digital marketing, combining cutting-edge artificial intelligence 
            with human creativity to deliver unprecedented results for our clients.
          </p>
          
          <p className="text-lg text-gray-300 leading-relaxed">
            Our team of experts leverages advanced AI algorithms to optimize campaigns, 
            predict market trends, and create personalized experiences that drive real business growth.
          </p>

          <div className="pt-4">
            <h3 className="text-2xl font-semibold text-white mb-4">Our Expertise</h3>
            <div ref={skillsRef} className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {skills.map((skill, index) => (
                <div 
                  key={index}
                  className="glass p-4 rounded-lg text-center card-hover group"
                >
                  <skill.icon 
                    size={32} 
                    className={`${skill.color} mx-auto mb-2 group-hover:scale-110 transition-transform duration-300`} 
                  />
                  <p className="text-sm text-gray-300">{skill.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;