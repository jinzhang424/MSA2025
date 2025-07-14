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
COPY .eslint.config.js index.html vite.config.js ./
COPY tsconfig*.json ./
COPY public ./public
COPY src ./src

###################################################
# Stage: frontend-dev
# 
# This stage is used for development of the frontend application. It sets 
# the default command to start the Vite development server.
###################################################
FROM frontend-base AS frontend-dev
CMD ["npm", "run", "dev"]

###################################################
# Stage: frontend-build
#
# This stage builds the frontend application, producing static HTML, CSS, and
# JS files that can be served by the backend.
###################################################
FROM frontend-base AS frontend-build
RUN npm run build