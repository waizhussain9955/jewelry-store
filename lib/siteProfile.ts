interface SocialMediaLinks {
  instagram: string;
  facebook: string;
  threads: string;
  github: string;
  linkedin: string;
}

interface SiteProfile {
  ownerName: string;
  brandName: string;
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  tagline: string;
  socialMedia: SocialMediaLinks;
}

export const SITE_PROFILE: SiteProfile = {
  ownerName: "Waiz Hussain",
  brandName: "Waiz Jewelry Store",
  email: "waizhussain9955@gmail.com",
  phone: "+92 327 2051549",
  whatsapp: "+92 327 2051549",
  location: "Karachi, Pakistan",
  tagline: "Affordable and stylish jewelry for daily wear and special days.",
  socialMedia: {
    instagram: "https://www.instagram.com/waiz_hussain_/",
    facebook: "https://www.facebook.com/waiz.hussain.ansari.2025/",
    threads: "https://www.threads.com/@waiz_hussain_?xmt=AQF0em6vQhOH5Z8yXuW031kli1vmAf6YKtiKyQL87Daux74",
    github: "https://github.com/waizhussain9955",
    linkedin: "https://www.linkedin.com/in/waiz-hussain-6750392ba/",
  },
};

export const CHATBOT_PROFILE = {
  name: "Zara",
  title: "Jewelry Assistant",
};
