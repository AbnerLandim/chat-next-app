FROM node:18-alpine 

# Copy in the project files
COPY . .

# Clean
USER root
RUN rm -fr node_modules

COPY package*.json ./
COPY next.config.mjs tsconfig.json ./
COPY tailwind.config.ts postcss.config.mjs ./

RUN npm install --dev typescript && \
npm install && \
npm cache clean --force

ENV NODE_ENV=production

RUN npm run build

EXPOSE 3000

# Running the app
CMD [ "node", ".next/standalone/server.js" ]