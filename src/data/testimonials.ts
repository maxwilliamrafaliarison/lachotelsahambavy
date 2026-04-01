export interface Testimonial {
  id: string;
  name: string;
  location: string;
  source: string;
  rating: number;
  text: { fr: string; en: string; es: string };
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Hélène",
    location: "France",
    source: "Booking.com",
    rating: 5,
    text: {
      fr: "L'hôtel est un havre de paix, la chambre très spacieuse est joliment décorée, avec élégance et goût. Le personnel est adorable, aux petits soins. Le jardin est magnifique et offre un joli cadre reposant.",
      en: "The hotel is a haven of peace, the very spacious room is beautifully decorated, with elegance and taste. The staff is adorable and attentive. The garden is magnificent and offers a lovely relaxing setting.",
      es: "El hotel es un remanso de paz, la habitación muy espaciosa está bellamente decorada, con elegancia y gusto. El personal es adorable y atento. El jardín es magnífico.",
    },
  },
  {
    id: "t2",
    name: "Raith",
    location: "United Kingdom",
    source: "Booking.com",
    rating: 5,
    text: {
      fr: "Le meilleur hôtel à Madagascar jusqu'ici. Excellent à tous les niveaux.",
      en: "The best hotel so far in Madagascar. Excellent in every way.",
      es: "El mejor hotel de Madagascar hasta ahora. Excelente en todos los sentidos.",
    },
  },
  {
    id: "t3",
    name: "Isabelle",
    location: "La Réunion",
    source: "Booking.com",
    rating: 5,
    text: {
      fr: "Un havre de paix, bungalows sur pilotis les pieds dans l'eau très confortables. Le personnel souriant et aux p'tits soins. Un magnifique jardin botanique bien entretenu. Et l'on y mange très bien. Je recommande vivement cet endroit hors du temps.",
      en: "A haven of peace, very comfortable overwater bungalows. Smiling and attentive staff. A magnificent well-maintained botanical garden. And the food is excellent. I highly recommend this timeless place.",
      es: "Un remanso de paz, bungalows sobre pilotes muy cómodos. Personal sonriente y atento. Un magnífico jardín botánico bien mantenido. Y se come muy bien. Recomiendo este lugar fuera del tiempo.",
    },
  },
  {
    id: "t4",
    name: "Klemm",
    location: "Suisse",
    source: "Booking.com",
    rating: 5,
    text: {
      fr: "Nous avons adoré le caractère unique de notre hébergement — nous avons séjourné dans le Wagon. Le personnel, surtout la dame qui nous a accueillis, était super accueillante et heureuse de partager des conseils sur la cuisine locale.",
      en: "We loved how unique our accommodation was; we stayed in the Train Wagon. The staff, especially the lady who received us was super inviting and happy to share tips on what local food we should try for dinner.",
      es: "Nos encantó lo único de nuestro alojamiento; nos quedamos en el Vagón. El personal fue muy acogedor y encantado de compartir consejos sobre la comida local.",
    },
  },
  {
    id: "t5",
    name: "Amelia",
    location: "France",
    source: "Booking.com",
    rating: 5,
    text: {
      fr: "Bungalows sur le lac très confortables. Le jardin est sublime. Personnel très accueillant. La cuisine était délicieuse.",
      en: "Very comfortable lakeside bungalows. The garden is sublime. Very welcoming staff. The food was delicious.",
      es: "Bungalows sobre el lago muy cómodos. El jardín es sublime. Personal muy acogedor. La cocina estaba deliciosa.",
    },
  },
  {
    id: "t6",
    name: "Michel",
    location: "France",
    source: "Booking.com",
    rating: 5,
    text: {
      fr: "Endroit magnifique, personnel très serviable et prévenant. Grand remerciement à Toky le réceptionniste !",
      en: "Magnificent place, very helpful and thoughtful staff. Big thanks to Toky the receptionist!",
      es: "Lugar magnífico, personal muy servicial y atento. ¡Muchas gracias a Toky el recepcionista!",
    },
  },
];
