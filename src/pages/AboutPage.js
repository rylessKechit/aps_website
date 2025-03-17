import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, ThumbsUp, Star } from 'lucide-react';
import config from '../config';

const AboutPage = () => {
  // Défiler vers le haut de la page au chargement
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Calculer le nombre d'années depuis la création
  const currentYear = new Date().getFullYear();
  const yearsInBusiness = currentYear - config.company.foundedYear;
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };
  
  return (
    <div className="about-page">
      <div className="page-hero">
        <div className="container">
          <h1>À propos d'APS TAXIS</h1>
          <p>Votre partenaire de confiance depuis {yearsInBusiness} ans</p>
        </div>
      </div>
      
      <div className="container">
        <div className="about-section">
          <motion.div 
            className="about-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Notre histoire</h2>
            <p>
              Fondé en {config.company.foundedYear}, APS TAXIS est né d'une passion pour le service 
              et d'une vision claire : offrir un service de transport de qualité, fiable et personnalisé 
              dans l'Essonne et au-delà. Ce qui a commencé comme une petite entreprise familiale 
              s'est développé pour devenir l'un des services de taxi les plus respectés de la région.
            </p>
            <p>
              Au fil des années, nous avons constamment adapté notre offre pour répondre aux besoins 
              changeants de nos clients, tout en maintenant les valeurs qui nous ont définis depuis 
              le début : l'excellence du service, la ponctualité et le confort.
            </p>
            <p>
              Aujourd'hui, avec une flotte moderne et des chauffeurs expérimentés, nous sommes fiers 
              de continuer à servir les résidents et visiteurs de l'Essonne, en leur offrant une 
              expérience de transport sans souci, qu'il s'agisse d'un trajet quotidien ou d'un 
              transfert aéroportuaire important.
            </p>
          </motion.div>
          
          <motion.div 
            className="about-image"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img 
              src="/images/about-history.jpg" 
              alt="Histoire d'APS TAXIS" 
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x400?text=Notre+Histoire';
              }}
            />
          </motion.div>
        </div>
        
        <motion.div 
          className="values-section"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2>Nos valeurs</h2>
          
          <div className="values-grid">
            <motion.div className="value-card" variants={itemVariants}>
              <div className="value-icon">
                <Shield size={40} />
              </div>
              <h3>Fiabilité</h3>
              <p>
                Nous comprenons l'importance de la ponctualité et de la fiabilité dans le transport. 
                Vous pouvez compter sur nous pour être là quand vous en avez besoin, chaque fois.
              </p>
            </motion.div>
            
            <motion.div className="value-card" variants={itemVariants}>
              <div className="value-icon">
                <Award size={40} />
              </div>
              <h3>Excellence</h3>
              <p>
                Nous nous efforçons d'offrir un service exceptionnel à chaque trajet. 
                Notre engagement envers l'excellence se reflète dans chaque aspect de notre service.
              </p>
            </motion.div>
            
            <motion.div className="value-card" variants={itemVariants}>
              <div className="value-icon">
                <ThumbsUp size={40} />
              </div>
              <h3>Professionnalisme</h3>
              <p>
                Nos chauffeurs sont formés aux standards les plus élevés de service client, 
                assurant une expérience professionnelle et courtoise à chaque trajet.
              </p>
            </motion.div>
            
            <motion.div className="value-card" variants={itemVariants}>
              <div className="value-icon">
                <Star size={40} />
              </div>
              <h3>Innovation</h3>
              <p>
                Nous investissons continuellement dans les nouvelles technologies et les véhicules 
                modernes pour offrir un service toujours plus efficace et confortable.
              </p>
            </motion.div>
          </div>
        </motion.div>
        
        <div className="team-section">
          <h2>Notre équipe</h2>
          <p>
            Chez APS TAXIS, notre plus grande force réside dans notre équipe. Nos chauffeurs 
            expérimentés connaissent parfaitement la région et sont dédiés à assurer votre 
            confort et votre sécurité. Chaque membre de notre équipe est soigneusement 
            sélectionné et formé pour offrir le meilleur service possible.
          </p>
          
          <motion.div 
            className="team-stats"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="stat-item">
              <div className="stat-number">{yearsInBusiness}</div>
              <div className="stat-label">Années d'expérience</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-number">20+</div>
              <div className="stat-label">Chauffeurs professionnels</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-number">15k+</div>
              <div className="stat-label">Courses par an</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-number">4.9</div>
              <div className="stat-label">Note moyenne client</div>
            </div>
          </motion.div>
        </div>
        
        <div className="commitment-section">
          <div className="commitment-content">
            <h2>Notre engagement écologique</h2>
            <p>
              Conscients des enjeux environnementaux, nous nous engageons à réduire notre 
              impact sur l'environnement. Notre flotte comprend des véhicules électriques 
              et hybrides, et nous optimisons constamment nos itinéraires pour minimiser 
              les émissions de CO2.
            </p>
            <p>
              Chez APS TAXIS, nous croyons qu'il est possible d'offrir un service de qualité 
              tout en respectant notre planète. C'est pourquoi nous investissons dans des 
              véhicules plus propres et des pratiques plus durables pour contribuer à un 
              avenir plus vert.
            </p>
          </div>
          
          <div className="commitment-image">
            <img 
              src="/images/eco-friendly.jpg" 
              alt="Engagement écologique" 
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x400?text=Eco-Friendly';
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;