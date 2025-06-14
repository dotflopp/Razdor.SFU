FROM node:24-alpine as build

WORKDIR /app
COPY package*.json ./

RUN npm i
COPY . .

RUN npm run build

CMD ["npm", "start"]
