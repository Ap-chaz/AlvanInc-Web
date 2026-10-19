/** Navigation structure shared by the navbar, mobile menu and footer. */
export const NAV_PRIMARY = [
  { label: "Work", to: "/work" },
  { label: "Services", to: "/services" },
  { label: "Pricing", to: "/pricing" },
  { label: "Process", to: "/process" },
  { label: "About", to: "/about" },
];

export const NAV_ALL = [
  ...NAV_PRIMARY,
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
];
