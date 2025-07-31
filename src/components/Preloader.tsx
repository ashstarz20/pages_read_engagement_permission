import React, { useEffect } from 'react';
import { gsap } from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  useEffect(() => {
    const tl = gsap.timeline();
    
    // Animate logo
    tl.from('.preloader-logo', {
      scale: 0.5,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    })
    // Animate progress bar
    .to('.progress-bar', {
      width: '100%',
      duration: 2,
      ease: 'power2.out'
    }, '-=0.5')
    // Animate percentage
    .to('.progress-text', {
      textContent: '100%',
      duration: 2,
      ease: 'power2.out',
      snap: { textContent: 1 },
      onUpdate: function() {
        const progress = Math.round(this.progress() * 100);
        document.querySelector('.progress-text')!.textContent = `${progress}%`;
      }
    }, '-=2')
    // Hide preloader
    .to('.preloader', {
      opacity: 0,
      scale: 0.9,
      duration: 1,
      delay: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        onComplete();
      }
    });
  }, [onComplete]);

  return (
    <div className="preloader">
      <div className="preloader-logo text-center">
        <h1 className="text-6xl font-bold gradient-text mb-4">STARZ</h1>
        <p className="text-xl text-gray-400">Ai Digital Marketing</p>
      </div>
      <div className="progress-container">
        <div className="progress-bar"></div>
      </div>
      <div className="progress-text text-white mt-4 font-mono">0%</div>
    </div>
  );
};

export default Preloader;