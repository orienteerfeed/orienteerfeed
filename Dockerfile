FROM nginx:latest

EXPOSE 8080

COPY ./mrb/ /usr/share/nginx/html/

FROM mysql:latest

EXPOSE 3306

FROM node:18-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

RUN npx prisma generate

#ENTRYPOINT ["npx", "prisma", "migrate", "deploy"]

# https://stackoverflow.com/questions/66646432/how-do-i-run-prisma-migrations-in-a-dockerized-graphql-postgres-setup

CMD ["npm", "run", "dev"]
