FROM node:14-alpine

WORKDIR /app

RUN apk add --no-cache bash --virtual .build-deps alpine-sdk python3

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build \
  && apk del .build-deps

CMD npm start
