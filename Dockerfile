FROM node:16
WORKDIR /usr/src/clean-node
COPY ./package.json .
RUN npm install --only=prod
COPY ./dist ./dist
EXPOSE 3000
CMD npm start