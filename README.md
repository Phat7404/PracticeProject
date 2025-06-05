# Music Track Management System

This project consists of two main components:
- A Next.js frontend application (`next-project`)
- A Nest.js backend application (`nest-project`)

## Project Structure

```
.
├── next-project/     # Frontend application (Next.js)
└── nest-project/     # Backend application (Nest.js)
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies for both projects:

Frontend:
```bash
cd next-project
npm install
```

Backend:
```bash
cd nest-project
npm install
```

### Development

To run the frontend development server:
```bash
cd next-project
npm run dev
```

To run the backend development server:
```bash
cd nest-project
npm run start:dev
```

## Features

- Upload individual FLAC files
- Upload entire folders of music tracks
- Track management and organization
- Modern, responsive user interface

## Environment Variables

Create `.env` files in both project directories with the following variables:

Frontend (.env.local):
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Backend (.env):
```
PORT=3001
```

## License

This project is licensed under the MIT License. 