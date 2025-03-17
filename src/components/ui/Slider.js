import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Composant Slider réutilisable
 * 
 * @param {Object} props - Propriétés du composant
 * @param {React.ReactNode[]} props.children - Slides à afficher
 * @param {boolean} [props.autoplay=false] - Activation du défilement automatique
 * @param {number} [props.autoplaySpeed=5000] - Durée entre chaque défilement en ms
 * @param {boolean} [props.dots=true] - Affichage des dots de navigation
 * @param {boolean} [props.arrows=true] - Affichage des flèches de navigation
 * @param {boolean} [props.pauseOnHover=true] - Pause du défilement au survol
 * @param {boolean} [props.infinite=true] - Défilement infini
 * @param {number} [props.slidesToShow=1] - Nombre de slides visibles
 * @param {number} [props.slidesToScroll=1] - Nombre de slides à défiler
 * @param {Function} [props.afterChange] - Fonction appelée après un changement de slide
 * @param {string} [props.className] - Classes CSS additionnelles
 */
const Slider = ({
  children,
  autoplay = false,
  autoplaySpeed = 5000,
  dots = true,
  arrows = true,
  pauseOnHover = true,
  infinite = true,
  slidesToShow = 1,
  slidesToScroll = 1,
  afterChange,
  className = '',
  ...rest
}) => {
  // Références
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);
  
  // États
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [sliderWidth, setSliderWidth] = useState(0);
  
  const totalSlides = React.Children.count(children);
  const slideWidth = sliderWidth / slidesToShow;
  
  // Mettre à jour la largeur du slider au redimensionnement
  useEffect(() => {
    const handleResize = () => {
      if (sliderRef.current) {
        setSliderWidth(sliderRef.current.offsetWidth);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Gérer le défilement automatique
  useEffect(() => {
    if (autoplay && !isHovered && !isSwiping) {
      intervalRef.current = setInterval(() => {
        goToNextSlide();
      }, autoplaySpeed);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoplay, isHovered, isSwiping, currentSlide]);
  
  // Navigation vers un slide
  const goToSlide = (index) => {
    let slideIndex = index;
    
    if (infinite) {
      if (index < 0) {
        slideIndex = totalSlides - slidesToShow;
      } else if (index > totalSlides - slidesToShow) {
        slideIndex = 0;
      }
    } else {
      if (index < 0) {
        slideIndex = 0;
      } else if (index > totalSlides - slidesToShow) {
        slideIndex = totalSlides - slidesToShow;
      }
    }
    
    setCurrentSlide(slideIndex);
    
    if (afterChange) {
      afterChange(slideIndex);
    }
  };
  
  // Aller au slide précédent
  const goToPrevSlide = () => {
    goToSlide(currentSlide - slidesToScroll);
  };
  
  // Aller au slide suivant
  const goToNextSlide = () => {
    goToSlide(currentSlide + slidesToScroll);
  };
  
  // Gestion du survol
  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsHovered(true);
    }
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  
  // Gestion du swipe sur mobile
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };
  
  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    setIsSwiping(false);
    
    const difference = touchStartX - touchEndX;
    const threshold = 50; // Seuil de déclenchement du swipe
    
    if (difference > threshold) {
      // Swipe vers la gauche, aller au slide suivant
      goToNextSlide();
    } else if (difference < -threshold) {
      // Swipe vers la droite, aller au slide précédent
      goToPrevSlide();
    }
  };
  
  // Calculer le style du slider
  const sliderStyle = {
    transform: `translateX(-${currentSlide * slideWidth}px)`,
    transition: isSwiping ? 'none' : 'transform 0.3s ease',
    display: 'flex',
    width: `${slideWidth * totalSlides}px`
  };
  
  // Classes CSS
  const sliderClasses = [
    'custom-slider',
    className
  ].filter(Boolean).join(' ');
  
  // Générer les dots
  const renderDots = () => {
    const dotsArray = [];
    const dotsCount = Math.ceil(totalSlides / slidesToScroll);
    
    for (let i = 0; i < dotsCount; i++) {
      dotsArray.push(
        <button
          key={i}
          className={`slider-dot ${i * slidesToScroll === currentSlide ? 'active' : ''}`}
          onClick={() => goToSlide(i * slidesToScroll)}
          aria-label={`Aller au slide ${i + 1}`}
        />
      );
    }
    
    return dotsArray;
  };
  
  return (
    <div 
      className={sliderClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      <div className="slider-container" ref={sliderRef}>
        {arrows && (
          <button 
            className="slider-arrow slider-arrow-prev"
            onClick={goToPrevSlide}
            disabled={!infinite && currentSlide === 0}
            aria-label="Slide précédent"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        
        <div 
          className="slider-track-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="slider-track" style={sliderStyle}>
            {React.Children.map(children, (child, index) => (
              <div
                className="slider-slide"
                style={{ width: `${slideWidth}px` }}
                key={index}
              >
                {child}
              </div>
            ))}
          </div>
        </div>
        
        {arrows && (
          <button 
            className="slider-arrow slider-arrow-next"
            onClick={goToNextSlide}
            disabled={!infinite && currentSlide >= totalSlides - slidesToShow}
            aria-label="Slide suivant"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
      
      {dots && (
        <div className="slider-dots">
          {renderDots()}
        </div>
      )}
    </div>
  );
};

export default Slider;