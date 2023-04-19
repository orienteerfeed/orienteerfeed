FROM node:18-slim

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "start:prod"]


#
# Ideally, this is what you want to achieve:
#

# FROM node:18-alpine AS builder

# WORKDIR /app

# COPY package*.json ./
# COPY prisma ./prisma/

# RUN npm install

# COPY . .

# RUN npm run build

# FROM node:18-alpine 

# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package*.json ./
# COPY --from=builder /app/build ./dist
# COPY --from=builder /app/prisma ./prisma

# EXPOSE 3001

# CMD ["npm", "run", "start:prod"]