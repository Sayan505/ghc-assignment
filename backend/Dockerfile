FROM node:slim

WORKDIR /opt/app/backend/
COPY . .

RUN npm ci

EXPOSE 3000

CMD ["npm", "run", "dev"]
