# BookBrief AI

An AI-powered book summary and recommendation platform built with Next.js. Users can sign up, generate intelligent summaries of books using OpenAI's GPT, receive personalized recommendations, and get summaries emailed to them.

## Features

- 🔐 **User Authentication**: Secure sign-in and sign-up using NextAuth.js with credentials provider
- 📚 **AI Book Summaries**: Generate comprehensive book summaries using OpenAI's GPT models
- 🤖 **Smart Recommendations**: Get AI-generated book recommendations based on summaries
- 📧 **Email Integration**: Send summaries and recommendations via email using SendGrid
- 💾 **Database Storage**: Store user data and summaries in MongoDB Atlas
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- 🚀 **Serverless Deployment**: Optimized for Vercel deployment

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Authentication**: NextAuth.js
- **Database**: MongoDB Atlas
- **AI**: OpenAI API
- **Email**: SendGrid
- **Deployment**: Vercel

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bookbrief-ai
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the required environment variables (see Environment Variables section).

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production
NEXTAUTH_URL=http://localhost:3000

# MongoDB Atlas
NEXT_ATLAS_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
NEXT_ATLAS_DATABASE=your-database-name

# OpenAI API
OPENAI_API_KEY=sk-your-openai-api-key

# SendGrid Email
SENDGRID_API_KEY=SG.your-sendgrid-api-key
SENDGRID_FROM_EMAIL=your-verified-email@example.com
```

### Setting up Environment Variables

1. **NextAuth Secret**: Generate a random secret key for JWT tokens
2. **MongoDB Atlas**: Create a cluster on MongoDB Atlas and get the connection string
3. **OpenAI API**: Get an API key from OpenAI platform
4. **SendGrid**: Create a SendGrid account and get an API key with email sending permissions

## Usage

### User Flow

1. **Landing**: Users are redirected to sign-in page if not authenticated
2. **Authentication**: Sign up or sign in with email and password
3. **Dashboard**: Enter a book title or description to generate a summary
4. **AI Processing**: The app uses OpenAI to generate summaries and recommendations
5. **Email Option**: Optionally enter email to receive summaries via email
6. **Sign Out**: Users can sign out from the dashboard

### API Endpoints

- `GET/POST /api/auth/[...nextauth]` - Authentication handling
- `POST /api/generate` - Generate book summaries and recommendations
- `POST /api/summaries` - Save summaries to database
- `POST /api/email` - Send summaries via email
- `GET /api/test` - Test endpoint

## Project Structure

```
bookbrief-ai/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── email/route.ts
│   │   ├── generate/route.ts
│   │   ├── summaries/route.ts
│   │   └── test/route.js
│   ├── auth/signin/page.tsx
│   ├── dashboard/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── lib/
│   └── mongodb.js
├── models/
├── public/
├── .env.local
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Deployment

### Vercel Deployment

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard (Project Settings > Environment Variables)
4. Deploy

### Environment Variables for Production

When deploying to Vercel, ensure these environment variables are set:

- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (set to your Vercel domain, e.g., `https://bookbrief-ai.vercel.app`)
- `NEXT_ATLAS_URI`
- `NEXT_ATLAS_DATABASE`
- `OPENAI_API_KEY`
- `SENDGRID_API_KEY`
- `SENDGRID_FROM_EMAIL`

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality

The project uses:
- TypeScript for type safety
- ESLint for code linting
- Tailwind CSS for styling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please open an issue on the GitHub repository.

---

Built with ❤️ using Next.js and AI
