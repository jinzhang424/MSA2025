###################################################
# Stage: frontend-base
#
# This stage is used as the base for the frontend-dev and frontend-build stages,
# since there are common steps needed for each.
###################################################
FROM node:20 AS frontend-base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY eslint.config.js index.html vite.config.ts ./
COPY tsconfig*.json ./
COPY public ./public
COPY src ./src
COPY .env ./.env

###################################################
# Stage: frontend-dev
# 
# This stage is used for development of the frontend application. It sets 
# the default command to start the Vite development server.
###################################################
FROM frontend-base AS frontend-dev
CMD ["npm", "run", "dev"]

###################################################
# Stage: frontend-production
#
# This stage builds the frontend application, producing static HTML, CSS, and
# JS files that can be served by the backend.
###################################################
FROM frontend-base AS frontend-build
RUN npm run build

###################################################
# Stage: frontend-production
#
# This stage builds the frontend application, producing static HTML, CSS, and
# JS files that can be served by the backend.
###################################################
FROM node:20 AS frontend-production
WORKDIR /app
RUN npm install -g serve
COPY --from=frontend-build /app/dist ./dist
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]