/**
 * Single source of truth for brand + contact details.
 * TODO(owner): every value marked TODO is a placeholder, replace with the real one.
 */
const WHATSAPP = "254714637437"; // TODO(owner): real number, international format, digits only
const WHATSAPP_TEXT = "Hello! I'd like to talk about a project.";

/** wa.me link with a prefilled message */
export const whatsappLink = (text = WHATSAPP_TEXT) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

// The backend address comes from .env.development locally and from the host's settings in production.
// "?." matters: Node (the SEO build) has no import.meta.env, and this file is loaded there too.
const API = import.meta.env?.VITE_API_URL ?? "";

export const SITE = {
  name: "AlvanInc",
  tagline: "Websites and brands built for African founders.",
  url: "https://alvaninc.vercel.app", // TODO(owner): real domain
  email: "alvaninc.studio@gmail.com", // TODO(owner): real email
  phone: "+254 714 637 437", // TODO(owner): real phone
  phoneHref: "tel:+254714637437", // TODO(owner)
  city: "Nairobi, Kenya",
  location: "Nairobi · Remote across East Africa",
  availability: "Taking on new projects", // TODO(owner): keep only while true, or add a month, e.g. "Booking from November"
  whatsappHref: `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(WHATSAPP_TEXT)}`,
  // TODO(owner): paste your form-service URL here (e.g. a free Formspree form: https://formspree.io/f/xxxxxxx).
  // While empty, the contact form opens the visitor's email app instead of sending by itself.
  formEndpoint: API ? `${API}/api/enquiries` : "",
  socials: [
    // TODO(owner): replace with your real profile URLs
    { label: "Instagram", href: "https://www.instagram.com/alvaninc?psln=dzdnZ2M5bno5b2Vu" },
   // { label: "LinkedIn", href: "https://www.linkedin.com/" },
  ],
};
