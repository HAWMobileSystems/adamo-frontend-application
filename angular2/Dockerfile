FROM node:10.15-alpine

WORKDIR /usr/src/application

COPY package*.json ./
RUN apk --no-cache add --virtual git && npm install 


# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "npm", "run", "build" ]