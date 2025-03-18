/**
 * Configuration globale de l'application APS TAXIS
 */

const config = {
    // Informations générales
    company: {
      name: "APS TAXIS",
      tagline: "Votre partenaire de confiance en Essonne",
      phone: "01 60 34 33 33",
      email: "contact@aps-taxis.fr",
      address: "Essonne (91)",
      foundedYear: 1973,
      operationHours: "24/7",
    },
    
    // Coordonnées géographiques (Essonne)
    location: {
      center: { lat: 48.6339, lng: 2.4408 },
      zoom: 11,
      bounds: {
        north: 48.7738,
        south: 48.4639,
        east: 2.5880,
        west: 2.1301
      }
    },
    
    // Tarifs
    pricing: {
      baseFare: 5, // Tarif de base en euros
      pricePerKm: {
        berline: 1.8,
        electrique: 2.0,
        van: 2.3
      },
      minimumFare: {
        berline: 15,
        electrique: 18,
        van: 25
      },
      airportSupplement: 10, // Supplément aéroport
      nightSupplement: 5,   // Supplément nuit (22h-6h)
      nightHours: {
        start: 22,
        end: 6
      },
      waitingPricePerHour: 30 // Prix par heure d'attente
    },
    
    // Configuration des véhicules
    vehicles: {
      types: [
        {
          id: "berline",
          name: "Berline",
          description: "Mercedes Classe E ou équivalent",
          capacity: {
            passengers: 3,
            luggage: 3
          },
          features: [
            "Climatisation",
            "WiFi gratuit",
            "Bouteilles d'eau",
            "Prises USB"
          ]
        },
        {
          id: "electrique",
          name: "Électrique",
          description: "Tesla Model 3 ou équivalent",
          capacity: {
            passengers: 4,
            luggage: 3
          },
          features: [
            "Zéro émission",
            "WiFi gratuit",
            "Climatisation",
            "Écran tactile"
          ]
        },
        {
          id: "van",
          name: "Van",
          description: "Mercedes Viano ou équivalent",
          capacity: {
            passengers: 7,
            luggage: 7
          },
          features: [
            "Espace généreux",
            "Climatisation",
            "WiFi gratuit",
            "Prises USB"
          ]
        }
      ]
    },
    
    // Services proposés
    services: [
      {
        id: "transferts-aeroports",
        name: "Transferts aéroports",
        description: "Service de navette vers tous les aéroports parisiens",
        icon: "plane"
      },
      {
        id: "transferts-gares",
        name: "Transferts gares",
        description: "Desserte de toutes les gares parisiennes",
        icon: "train"
      },
      {
        id: "deplacements-pro",
        name: "Déplacements professionnels",
        description: "Service dédié pour vos rendez-vous d'affaires",
        icon: "briefcase"
      },
      {
        id: "mise-a-disposition",
        name: "Mise à disposition",
        description: "Chauffeur à votre disposition pour la durée de votre choix",
        icon: "clock"
      },
      {
        id: "transport-cpam",
        name: "Transports CPAM",
        description: "Transport de personnes pour rendez-vous médicaux",
        icon: "heart"
      },
      {
        id: "service-24-7",
        name: "Service 24/7",
        description: "Disponible 24h/24 et 7j/7 pour tous vos besoins",
        icon: "clock"
      }
    ],
    
    // Destinations fréquentes
    destinations: {
      airports: [
        {
          id: "orly",
          name: "Aéroport d'Orly",
          code: "ORY"
        },
        {
          id: "cdg",
          name: "Aéroport Roissy Charles de Gaulle",
          code: "CDG"
        },
        {
          id: "beauvais",
          name: "Aéroport de Beauvais-Tillé",
          code: "BVA"
        }
      ],
      stations: [
        {
          id: "massy-tgv",
          name: "Gare de Massy TGV"
        },
        {
          id: "massy-palaiseau",
          name: "Gare de Massy-Palaiseau"
        },
        {
          id: "juvisy",
          name: "Gare de Juvisy"
        },
        {
          id: "evry",
          name: "Gare d'Évry-Courcouronnes"
        },
        {
          id: "gare-de-lyon",
          name: "Gare de Lyon (Paris)"
        },
        {
          id: "gare-du-nord",
          name: "Gare du Nord (Paris)"
        },
        {
          id: "gare-montparnasse",
          name: "Gare Montparnasse (Paris)"
        }
      ],
      cities: [
        "Massy", "Palaiseau", "Longjumeau", "Verrières-le-Buisson", 
        "Orsay", "Gif-sur-Yvette", "Villebon-sur-Yvette", "Les Ulis",
        "Évry", "Corbeil-Essonnes", "Savigny-sur-Orge", "Viry-Chatillon",
        "Athis-Mons", "Draveil", "Courcouronnes", "Sainte-Geneviève-des-Bois"
      ]
    },
    
    // Paramètres de l'API
    api: {
      baseUrl: "https://api.aps-taxis.fr",
      endpoints: {
        booking: "/booking",
        estimation: "/estimate",
        contact: "/contact",
        geocoding: "/geocode"
      },
      googleMapsApiKey: "AIzaSyA746fHg3bUH2Cvl49PbYZ1sp0e5d2F_tU" // À remplacer par votre clé API
    },
    
    // Réglages de réservation
    booking: {
      minAdvanceTime: 30, // Temps minimum en minutes avant la réservation
      defaultAdvanceTime: 60, // Temps par défaut en minutes pour le champ heure
      maxPassengers: 7,
      maxLuggage: 7,
      airportKeywords: ['aéroport', 'airport', 'orly', 'roissy', 'cdg', 'charles de gaulle'],
      commonAddresses: [
        'Aéroport d\'Orly, Orly',
        'Aéroport Roissy Charles de Gaulle',
        'Gare de Massy TGV, Massy',
        'Gare de Massy-Palaiseau, Massy',
        'Centre Commercial Evry 2, Evry',
        'Mairie de Palaiseau, Palaiseau',
        'Hôpital d\'Orsay, Orsay',
        'École Polytechnique, Palaiseau',
        'Université Paris-Saclay, Orsay',
        'Centre Commercial Vélizy 2, Vélizy-Villacoublay'
      ]
    },
    
    // URL des réseaux sociaux
    socialMedia: {
      facebook: "https://facebook.com/aps-taxis",
      instagram: "https://instagram.com/aps-taxis",
      twitter: "https://twitter.com/aps-taxis",
      linkedin: "https://linkedin.com/company/aps-taxis"
    }
  };
  
  export default config;