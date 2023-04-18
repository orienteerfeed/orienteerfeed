FROM node:18-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

RUN npx prisma generate

RUN npx prisma migrate deploy

CMD ["npm", "run", "dev"]
