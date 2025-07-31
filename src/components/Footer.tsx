import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  GoogleLogo, 
  WhatsappLogo, 
  InstagramLogo, 
  LinkedinLogo 
} from '@phosphor-icons/react';

gsap.registerPlugin(ScrollTrigger);

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    // Footer animation
    gsap.from(footer.children, {
      scrollTrigger: {
        trigger: footer,
        start: 'top 90%',
      },
      y: 60,
      opacity: 0,
      filter: 'blur(10px)',
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out'
    });

    // Floating particles animation
    gsap.to('.footer-particle', {
      y: -15,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      stagger: 0.8
    });
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Industries', href: '#industries' },
    { name: 'AI CRM', href: '#crm' },
    { name: 'Contact', href: '#contact' }
  ];

  const socialLinks = [
    { icon: GoogleLogo, href: '#', color: 'hover:text-red-400' },
    { icon: WhatsappLogo, href: '#', color: 'hover:text-green-400' },
    { icon: InstagramLogo, href: '#', color: 'hover:text-pink-400' },
    { icon: LinkedinLogo, href: '#', color: 'hover:text-blue-400' }
  ];

  return (
    <footer 
      ref={footerRef}
      className="relative py-16 px-4 mt-20 overflow-hidden"
    >
      {/* Background particles */}
      <div className="absolute inset-0">
        <div className="footer-particle absolute top-10 left-20 w-2 h-2 bg-blue-400/30 rounded-full"></div>
        <div className="footer-particle absolute top-20 right-32 w-3 h-3 bg-purple-400/20 rounded-full"></div>
        <div className="footer-particle absolute bottom-20 left-40 w-2 h-2 bg-cyan-400/40 rounded-full"></div>
        <div className="footer-particle absolute bottom-32 right-20 w-4 h-4 bg-pink-400/20 rounded-full"></div>
        <div className="footer-particle absolute top-40 left-1/2 w-2 h-2 bg-green-400/30 rounded-full"></div>
        <div className="footer-particle absolute bottom-10 left-1/4 w-3 h-3 bg-yellow-400/20 rounded-full"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Main footer content */}
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Logo and description */}
          <div>
            <img 
              src="/images/Starz Ai logo.png" 
              alt="STARZ Ai" 
              className="h-12 w-auto mb-4"
            />
            <p className="text-gray-400 leading-relaxed">
              Revolutionizing digital marketing with AI-powered solutions. 
              Transform your business with cutting-edge technology and expert strategies.
            </p>
          </div>

          {/* Navigation links */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors duration-300 py-1"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">Connect</h3>
            <div className="space-y-3 mb-6">
              <p className="text-gray-400">hello@starzai.com</p>
              <p className="text-gray-400">+91 XXX XXX XXXX</p>
            </div>
            
            {/* Social links */}
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`w-10 h-10 glass rounded-lg flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 hover:scale-110`}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 STARZ Ai. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
    </footer>
  );
};

export default Footer;