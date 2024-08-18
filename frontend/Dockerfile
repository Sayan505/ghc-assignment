FROM node:slim

WORKDIR /opt/app/frontend/
COPY . .

RUN npm ci

EXPOSE 3001

CMD ["npm", "start"]
