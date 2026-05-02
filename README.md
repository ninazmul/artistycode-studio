# ArtistyCode Studio

ArtistyCode Studio is a modern, full-stack Next.js web application. It features a robust authentication system, a responsive UI built with Tailwind CSS and Framer Motion, and a MongoDB database for scalable data storage.

## Features

- **Framework**: [Next.js](https://nextjs.org/) (v16)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **File Uploads**: [UploadThing](https://uploadthing.com/)
- **Charts**: [Chart.js](https://www.chartjs.org/) & `react-chartjs-2`
- **Email**: [Nodemailer](https://nodemailer.com/)

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

To run this project locally, you will need to set up the appropriate environment variables. Create a `.env.local` file in the root directory and add the necessary keys for:

- Clerk (Authentication)
- MongoDB (Database connection string)
- UploadThing (File storage)
- Nodemailer (Email configuration)
- Svix (Webhooks)

*(Note: Actual environment variable keys are not shared in this repository for security reasons.)*

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

You can also use the included deployment script:

```bash
npm run deploy
```

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
