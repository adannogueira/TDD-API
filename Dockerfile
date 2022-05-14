FROM node:16
WORKDIR /usr/clean-node
COPY ./package.json .
RUN npm set-script prepare ""
RUN npm install --only=prod