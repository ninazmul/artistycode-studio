export const headerLinks = [
  {
    label: "Home",
    route: "/",
  },
  {
    label: "About Us",
    route: "#about",
  },
  {
    label: "Projects",
    route: "#projects",
  },
  {
    label: "Resources",
    route: "#resources",
  },
  {
    label: "Contact Us",
    route: "#contact",
  },
];

export const Committee = [
  {
    position: "President",
    name: "Md Shamsul Islam",
  },
  {
    position: "Vice President",
    name: "Md Sakawat Hossain",
  },
  {
    position: "Treasurer",
    name: "Md Didarul Alam",
  },
  {
    position: "General Secretary",
    name: "Md Abul Hossain",
  },
  {
    position: "Public Officer",
    name: "(Acting) Md Abul Hossain",
  },
];

export const eventDefaultValues = {
  title: "",
  description: "",
  location: "",
  createdAt: new Date(),
  imageUrl: "",
  url: "",
};

export const registrationDefaultValues = {
  firstName: "",
  lastName: "",
  address: "",
  number: "",
  email: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  emergencyContactRelation: "",
  date: new Date(),
  status: "pending",
  userId: "",
};

export const resourceDefaultValues = {
  heading: "",
  image: "",
  link: "",
  category: "",
};