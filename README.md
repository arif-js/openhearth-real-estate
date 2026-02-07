# OpenHearth | Premium Real Estate Platform

OpenHearth is a high-performance, modern real estate platform designed for seamless property discovery and lead management. Built with Next.js and powered by Airtable as a headless CMS.

## 🚀 Features

- **Dynamic Property Discovery**: Search and browse high-quality listings with deep search capabilities across titles, descriptions, and locations.
- **Advanced Filtering & Sorting**: Robust filter bar for search by price range, bedrooms, and status, with multiple sorting options.
- **Interactive Property Map**: Premium geospatial integration using Leaflet, featuring custom markers, property clusters, and a high-tech blue aesthetic.
- **Secure Authentication**: Powerded by Clerk, allowing users to save their favorite homes and access a personalized dashboard.
- **Lead Management**: Integrated inquiry forms that capture leads directly into Airtable for agent follow-up.
- **SEO & Performance Optimized**: Built with Next.js 15 App Router for blazing-fast performance and optimal search engine visibility.
- **Premium UI/UX**: A responsive, modern design with dark mode support, glassmorphism elements, and smooth animations.

## 🛠️ Tech Stack

- **Frontend**: [Next.js 15+](https://nextjs.org/) (App Router)
- **CMS / Database**: [Airtable](https://airtable.com/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Mapping**: [Leaflet](https://leafletjs.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

### Prerequisites

You will need the following environment variables. See `.env.example` for reference:

```bash
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Airtable Configuration
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=
```

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📄 License

This project is licensed under the MIT License.
