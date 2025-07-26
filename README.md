### Introduction

Cocreate is a platform where students and creators can connect overs shared ideas and build meaningful side projects together. It aims to bring people with many skillsets different skillsets together. Whether its a designer with a concept, developer looking to collaborate or a team/group who needs a specialist, CoCreate will help bring like minded individuals together

  

### How it relates to networking

CoCreate is fundamentally built around the concept of 'networking for creators'. Unlike general social media platforms, CoCreate is tailored to forming purpose-driven technical relationships.
- Users post their project ideas, describing what they’re building and what kind of help they need.
- Others can explore these ideas to find something that fits them
- Each project will have a hub of discussion, allowing users to interact and build connections as they collaborate

  

### Why this project stands out

- Livechats for each project: Each project will have its own real time chatroom enabling easy and efficient collobration.
- Dynamic Avatars: Each user will get a randomly generated avatar from the Dicebear api, adding personality to a user's profile
- Project Management: Easy and effective project management allowing project creators to manage their projects efficiently
- Simple application process: Just a short message about yourself (e.g. skills and what you can bring to the team) and availability
- Dockerized: Setup docker with a production and development environment
- Browsing/searching system: The browsing and searching of projects is intuitive. Filtering is done in a click of a button and all major project information is displayed nicely on a card.
- Efficient data fetching and caching: Uses the React Query library to manage server state, providing fast, reliable, and up-to-date project data with automatic caching and background updates.

  

### Advanced Features
- Implement Websockets: Implemented a livechat using SignalR
- State Management Library: Used Redux for managing the user and dashboard states
- Dockerize: Dockerized frontend and backend using docker

### Running Project Locally

1. Copy the provided .env file that contains VITE_API_URL into the frontend directory root
2. Copy the provided .env file that contains a JWT_SECRET and DATABASE_URL into the root directory
3. Run `docker compose -f docker-compose.dev.yml up` for development build or `docker compose up` for production build
