import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  PaperPlaneTilt, 
  GoogleLogo, 
  WhatsappLogo, 
  InstagramLogo, 
  LinkedinLogo,
  MapPin,
  Phone,
  Envelope
} from '@phosphor-icons/react';

gsap.registerPlugin(ScrollTrigger);

const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    const section = sectionRef.current;
    const form = formRef.current;

    if (!section || !form) return;

    // Title animation
    gsap.from('.contact-title', {
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

    // Form inputs animation
    gsap.from('.form-input', {
      scrollTrigger: {
        trigger: form,
        start: 'top 80%',
      },
      x: -50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out'
    });

    // Social icons animation
    gsap.from('.social-icon', {
      scrollTrigger: {
        trigger: '.social-icons',
        start: 'top 80%',
      },
      scale: 0,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'back.out(1.7)'
    });

    // Floating particles
    gsap.to('.particle', {
      y: -20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      stagger: 0.5
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Submit button animation
    const submitBtn = e.currentTarget.querySelector('.submit-btn') as HTMLElement;
    gsap.to(submitBtn, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out'
    });

    // Here you would typically handle form submission
    console.log('Form submitted:', formData);
    
    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  const socialLinks = [
    { icon: GoogleLogo, href: '#', color: 'hover:text-red-400' },
    { icon: WhatsappLogo, href: '#', color: 'hover:text-green-400' },
    { icon: InstagramLogo, href: '#', color: 'hover:text-pink-400' },
    { icon: LinkedinLogo, href: '#', color: 'hover:text-blue-400' }
  ];

  return (
    <section 
      id="contact" 
      ref={sectionRef}
      className="py-20 px-4 max-w-7xl mx-auto relative"
    >
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="particle absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full opacity-60"></div>
        <div className="particle absolute top-40 right-32 w-3 h-3 bg-purple-400 rounded-full opacity-40"></div>
        <div className="particle absolute bottom-32 left-40 w-2 h-2 bg-cyan-400 rounded-full opacity-50"></div>
        <div className="particle absolute bottom-20 right-20 w-4 h-4 bg-pink-400 rounded-full opacity-30"></div>
        <div className="particle absolute top-60 left-1/2 w-2 h-2 bg-green-400 rounded-full opacity-60"></div>
      </div>

      <div className="text-center mb-16">
        <h2 className="contact-title text-5xl font-bold gradient-text mb-4">
          Get In Touch
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Ready to transform your digital marketing with AI? Let's start the conversation.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="glass rounded-2xl p-8">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="form-input">
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all duration-300"
                placeholder="Your Name"
              />
            </div>

            <div className="form-input">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all duration-300"
                placeholder="your@email.com"
              />
            </div>

            <div className="form-input">
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={5}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all duration-300 resize-none"
                placeholder="Tell us about your project..."
              />
            </div>

            <button
              type="submit"
              className="submit-btn w-full btn-glow py-4 rounded-lg inline-flex items-center justify-center gap-3 group"
            >
              <span>Send Message</span>
              <PaperPlaneTilt 
                size={20} 
                className="group-hover:translate-x-1 transition-transform duration-300" 
              />
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-8">
          {/* Address */}
          <div className="glass rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Our Office</h3>
                <p className="text-gray-300 leading-relaxed">
                  Office No 19, Vinay Heritage, near Tata Motors, Vinay Nagar, 
                  Kashigaon, Mira Road East, Thane, Mumbai, Maharashtra 401107
                </p>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="glass rounded-2xl p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <Phone size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Phone</h4>
                  <p className="text-gray-300">+91 XXX XXX XXXX</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Envelope size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Email</h4>
                  <p className="text-gray-300">hello@starzai.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="glass rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-white mb-6">Follow Us</h3>
            <div className="social-icons flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`social-icon w-12 h-12 glass rounded-lg flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 hover:scale-110`}
                >
                  <social.icon size={24} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;