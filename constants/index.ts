export const headerLinks = [
  {
    label: "Home",
    route: "/",
  },
  {
    label: "About Us",
    route: "/about",
  },
  {
    label: "Projects",
    route: "/projects",
  },
  {
    label: "Testimonials",
    route: "/testimonials",
  },
  {
    label: "Contact Us",
    route: "/contact",
  },
  {
    label: "Blog",
    route: "/blog",
  },
  {
    label: "Buy Code",
    route: "/resources",
  },
];

export const projectDefaultValues = {
  title: "",
  description: "",
  stack: "",
  image: "",
  url: "",
  category: "",
  author: "",
};

export const transactionDefaultValues = {
  date: new Date(),
  project: "",
  category: "",
  amount: "",
  due_amount: "",
  notes: "",
};

export const resourceDefaultValues = {
  title: "",
  description: "",
  stack: "",
  image: "",
  url: "",
  file: "",
  price: "",
  isFree: false,
  category: "",
  author: "",
};

export const HOSTINGER_PARTNER = {
  name: "Hostinger",
  partnerTitle: "Official Hostinger Partner",
  referralUrl: "https://www.hostinger.com?REFERRALCODE=ACSTUDIO",
  couponCode: "ACSTUDIO",
  discountPercent: "20%",
  discountOfferText: "Get up to 20% discount on your first purchase",
  bannerImages: {
    brandDark640: "/assets/hostinger/badge-brand-dark-640x240.webp",
    brandDark320: "/assets/hostinger/badge-brand-dark-320x120.png",
    brandDarkSquare: "/assets/hostinger/badge-brand-dark-square-240x240.webp",
    dark640: "/assets/hostinger/badge-dark-640x240.webp",
    dark320: "/assets/hostinger/badge-dark-320x120.png",
    light640: "/assets/hostinger/badge-brand-light-640x240.webp",
  },
  perks: [
    "Up to 20% OFF First Purchase",
    "Free Domain & Unlimited SSL",
    "High-Speed NVMe Storage",
    "Optimized for WordPress & Next.js",
    "24/7 Premium Customer Support",
    "99.9% Uptime Guarantee",
  ],
};

