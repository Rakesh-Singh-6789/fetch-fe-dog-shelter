# Fetch Dog Shelter

A React application for browsing and finding shelter dogs, developed using Fetch API.

## Live Demo

The application is deployed and available at [fetchrewards-dog-shelter.netlify.app](https://fetchrewards-dog-shelter.netlify.app)

## Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/Rakesh-Singh-6789/fetch-fe-dog-shelter.git
   cd fetch-dog-shelter
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser

## Features

1. **User Authentication** - Simple login and logout with name and email
2. **Dog Search** - Browse available dogs with pagination and search functionality
3. **Advanced Filtering** - Filter dogs by:
   - Multiple breeds (select from complete breed list)
   - Age range (minimum and maximum)
   - Location (search by ZIP codes)
4. **Sorting Options** - Sort results by:
   - Breed (A-Z or Z-A)
   - Name (A-Z or Z-A)
   - Age (youngest or oldest first)
5. **Favorites Management** - Add/remove dogs to your favorites list with persistent storage
6. **Dog Matching Algorithm** - Generate your perfect match based on your favorited dogs
7. **Location-Based Search** - Dedicated page for searching and selecting locations by:
   - States
   - Cities
   - ZIP codes
   - Geographical areas
8. **Responsive Design** - Beautiful UI that works on both desktop and mobile devices
9. **Image Handling** - Graceful fallback for images with loading errors
10. **Detailed Dog View** - Modal with detailed information about each dog
11. **Card-Based Interface** - Easy-to-scan cards showing key dog information
12. **Premium UI Elements** - Sophisticated animations, transitions, and visual feedback

## Technologies Used

- React
- TypeScript
- Material UI
- React Router
- Axios for API calls

## Code Quality Highlights

- **Clean, Modular Architecture** - Components, services, and utilities are organized into logical directories
- **Component Reusability** - UI components designed to be reusable across different parts of the application
- **Custom Hooks** - Separation of data fetching and UI logic into custom hooks (e.g., `useDogSearch`)
- **Context-based State Management** - Centralized application state for authentication, favorites, and filters
- **TypeScript Interfaces** - Strong typing enforced throughout the codebase
- **Optimized Bundle Size** - Unused dependencies and imports removed to improve performance
- **Consistent Patterns** - Consistent coding patterns and naming conventions

## API

This project uses the Fetch API service at `https://frontend-take-home-service.fetch.com`.

The following endpoints are used:
- `/auth/login` - User authentication
- `/auth/logout` - User logout
- `/dogs/breeds` - Get list of all dog breeds
- `/dogs/search` - Search for dogs with filtering
- `/dogs` - Get details for specific dogs
- `/dogs/match` - Generate a match based on favorite dogs
