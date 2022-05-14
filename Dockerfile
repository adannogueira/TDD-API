FROM node:16
WORKDIR /usr/clean-node
COPY ./package.json .
RUN npm install --only=prod --ignore-scripts