FROM node:16.13.0-alpine3.14

WORKDIR /opt/app

COPY . .

RUN npm install --only=prod

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ARG PORT=8080
ENV PORT $PORT
EXPOSE $PORT

CMD [ "node", "index.js" ]