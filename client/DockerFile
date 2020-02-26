FROM node:9-alpine

RUN mkdir -p /srv/app/client

WORKDIR /srv/app/client

COPY . /srv/app/client

RUN npm install

CMD ["npm","start"]