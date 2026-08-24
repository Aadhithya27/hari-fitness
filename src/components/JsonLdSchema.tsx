import React from "react";

export function JsonLdSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hari-fitness.vercel.app";

  // 1. Business & Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["SportsActivityLocation", "HealthAndBeautyBusiness", "Organization"],
    "@id": `${baseUrl}/#organization`,
    name: "Hari Fitness",
    alternateName: "Coach Hari Fitness SaaS",
    url: baseUrl,
    logo: `${baseUrl}/favicon.ico`,
    image: `${baseUrl}/images/transformations/trainer-after.jpg`,
    description: "Premium personal training SaaS ecosystem by Coach Hari. Tailored hypertrophy, fat loss, nutrition tracking, and accountability.",
    priceRange: "₹5999 - ₹8999",
    telephone: "+91-9876543210",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    sameAs: [
      "https://instagram.com/hari_fitness",
      "https://youtube.com/harifitness"
    ],
    knowsAbout: [
      "Personal Training",
      "Powerlifting",
      "Hypertrophy",
      "Nutrition & Fat Loss",
      "Injury Rehabilitation"
    ]
  };

  // 2. Person (Coach Hari) Schema
  const coachSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${baseUrl}/#coach`,
    name: "Coach Hari",
    jobTitle: "Master Fitness Coach & Powerlifting Athlete",
    worksFor: {
      "@id": `${baseUrl}/#organization`
    },
    hasCredential: [
      "Muscle Mentors Academy Certified",
      "Certified Nutritionist",
      "Hypertrophy Specialist",
      "Post-Injury Rehabilitation Specialist"
    ],
    award: [
      "3x State Powerlifting Gold Medalist",
      "District Powerlifting Silver Medalist",
      "District Powerlifting Bronze Medalist"
    ],
    image: `${baseUrl}/images/transformations/trainer-after.jpg`,
    description: "Master trainer with 8+ years experience in powerlifting, body transformations, and personalized scientific nutrition."
  };

  // 3. FAQPage Schema (Google Rich Snippets)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How does Coach Hari's 1-on-1 personal coaching work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Coach Hari builds a scientific workout and nutrition plan tailored to your specific biomechanics, work schedule, and fitness goals. You get direct access to the client dashboard to track sets, reps, weight logs, and daily nutrition snaps."
        }
      },
      {
        "@type": "Question",
        name: "What is included in the Client Dashboard?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The dashboard features active workout logging with rest timers, macro & calorie tracking with daily food photo uploads, hydration streak counters, body measurement diagnostic charts, and direct messaging with Coach Hari."
        }
      },
      {
        "@type": "Question",
        name: "How are nutrition macros calculated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Macros are customized based on your body composition, energy expenditure, and target weight goal (lean bulk or fat loss). Daily meals and food snaps are logged directly inside the client workspace."
        }
      },
      {
        "@type": "Question",
        name: "Can beginners join Hari Fitness programs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! Plans are customized for all levels from complete beginners seeking body recomposition to advanced lifters aiming for powerlifting or hypertrophy goals."
        }
      }
    ]
  };

  // 4. WebSite Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: "Hari Fitness",
    publisher: {
      "@id": `${baseUrl}/#organization`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(coachSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
