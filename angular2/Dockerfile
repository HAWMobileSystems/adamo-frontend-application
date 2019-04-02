# Base Node 

FROM node:10.15-alpine as base
# WORKDIR .
COPY package.json .
# Uncomment below if you're using .npmrc
# COPY .npmrc . 
# Dependencies
FROM base as dependencies
# RUN npm set progress =false && npm config set depth 0 
# RUN npm install --only=production
RUN apk add --no-cache git
RUN yarn

# Test
# FROM dependencies as test
# copy . . 
# RUN npm run lint && npm run test 
# COPY ./ /src/

FROM base as release
COPY --from=dependencies . .
COPY . . 
RUN node src/set-env.js --environment=dev
RUN yarn docker:build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
WORKDIR /usr/share/nginx/html
COPY --from=release /cache/dist/ .

# FROM node:10.15-alpine

# WORKDIR /usr/src/application

# COPY package*.json ./
# RUN apk --no-cache add --virtual git && npm install 


# # Bundle app source
# COPY . .

# EXPOSE 8080
# CMD [ "npm", "run", "serve" ]


