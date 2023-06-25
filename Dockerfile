FROM node:18

WORKDIR /home/app

COPY . .

RUN npm install
RUN npm run build
RUN npm run postbuild

EXPOSE 3000

CMD ["npm", "run", "start"]