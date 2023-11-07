FROM node:latest

WORKDIR /app

COPY package*.json ./

COPY index.js ./

RUN npm install

COPY . .

EXPOSE 8800

CMD [ "node", "index.js" ]
