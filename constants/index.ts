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
