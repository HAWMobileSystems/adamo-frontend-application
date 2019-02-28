FROM node:10.15-alpine

# Install dependecies for node-gyp (fuck off - really)
# RUN apk add --no-cache make gcc g++ python && \
#   npm install --production --silent && \
#   apk del make gcc g++ python

# Create app directory
WORKDIR /usr/src/server
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
# If you are building your code for production
# RUN npm install --only=production
# Bundle app source
COPY . .
# RUN apk --no-cache add --virtual builds-deps build-base python && npm install && apk del builds-deps

RUN npm install

# RUN apk --no-cache add krb5-dev
# RUN apk add --no-cache --virtual .build-deps alpine-sdk python \
#  && npm install node-gyp -g \
#  && npm install --production --silent \
#  && apk del .build-deps  

# RUN apk --no-cache add --virtual native-deps \
#   g++ gcc libgcc libstdc++ linux-headers make python krb5-dev && \
#   npm install node-gyp -g &&\
#   npm install --quiet && \
#   apk del native-deps


EXPOSE 3330 4711
# CMD [ "node ./lib/mqttserver.js", "node ./lib/express.js" ]
