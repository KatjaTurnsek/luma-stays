# Luma Stays

Luma Stays is a front-end accommodation booking application built for Noroff Project Exam 2. The project uses the Holidaze API and allows users to browse venues, create bookings, and manage venues depending on their account type.

## Live Site

[Luma Stays App](https://luma-stays.netlify.app/)

## GitHub Repository

[GitHub repository](https://github.com/KatjaTurnsek/luma-stays)

## Planning and Design

- [GitHub kanban board](https://github.com/users/KatjaTurnsek/projects/4)
- [GitHub roadmap view](https://github.com/users/KatjaTurnsek/projects/4/views/4?filterQuery=assignee%3AKatjaTurnsek)
- [Figma style guide](https://www.figma.com/design/L5xZ4AgRdzgWpowmBUeHSS/projects-2?node-id=1053-134&t=knPQnhx20euH5OhT-1)
- [Figma prototype/design mobile](https://www.figma.com/design/L5xZ4AgRdzgWpowmBUeHSS/projects-2?node-id=1076-14347&t=knPQnhx20euH5OhT-1)
- [Figma prototype/design desktop](https://www.figma.com/design/L5xZ4AgRdzgWpowmBUeHSS/projects-2?node-id=1060-2670&t=knPQnhx20euH5OhT-1)

## Description

Luma Stays is designed as a calm and premium booking experience. Visitors can browse and search venues, view venue details, and check available dates. Registered customers can create and manage bookings. Venue managers can create, edit, and delete venues, view upcoming bookings for their venues, and update their profile avatar.

## Built With

- React
- Vite
- JavaScript
- Bootstrap
- CSS
- Noroff Holidaze API
- JSDoc

## Features

### All Users

- View a list of venues
- Search for venues
- Filter venues by guest count
- Sort venues by newest, price, or rating
- View a specific venue page
- View availability and booked dates in a calendar
- Register as a customer or venue manager

### Customers

- Log in and log out
- Create bookings
- View upcoming bookings
- Cancel bookings
- Update profile avatar

### Venue Managers

- Log in and log out
- Create venues
- Edit venues
- Delete venues
- Add or update venue rating
- View upcoming bookings for managed venues
- Update profile avatar

## Getting Started

### Install

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root and add your Noroff API key:

```env
VITE_NOROFF_API_KEY=your_api_key_here
```

### Run Locally

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

### Generate JSDoc

```bash
npm run docs
```

## API

This project uses the Noroff API v2 Holidaze endpoints for venues, bookings, profiles, authentication, and API key handling.

API documentation:  
https://docs.noroff.dev/docs/v2/holidaze/venues

## Testing

The project was tested with:

- Manual user story testing
- ESLint
- Vite production build
- Browser responsive testing
- HTML Validator
- Lighthouse
- WAVE accessibility checker

Main flows tested:

- Visitor browsing and searching venues
- Customer registration, login, booking, profile, avatar update, and logout
- Venue manager registration, login, venue create/edit/delete, booking overview, avatar update, and logout

## Project Structure

```text
src/
  api/
  assets/
  components/
  hooks/
  layouts/
  pages/
  styles/
  utils/
```

## Author

Katja Turnšek  
Front-End Developer & UI/UX Designer  
GitHub: https://github.com/KatjaTurnsek
