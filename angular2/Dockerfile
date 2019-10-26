# Base Node 

# FROM node:10.15-alpine as base
# # WORKDIR .
# COPY package.json .
# # Uncomment below if you're using .npmrc
# # COPY .npmrc . 
# # Dependencies
# FROM base as dependencies
# # RUN npm set progress =false && npm config set depth 0 
# # RUN npm install --only=production
# RUN apk add --no-cache git
# RUN yarn

# # Test
# FROM dependencies as test
# COPY . . 
# RUN npm run lint && npm run test 
# COPY ./ /test/
### STAGE 1: Build ###

# We label our stage as ‘builder’
FROM node:10-alpine as builder
RUN apk add --no-cache git
COPY package.json package-lock.json ./
## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN yarn && mkdir /ng-app && mv ./node_modules ./ng-app
WORKDIR /ng-app
COPY . .
## Build the angular app in production mode and store the artifacts in dist folder
#RUN $(npm bin)/ng build --prod --output-path=dist
RUN yarn docker:build:dev

### STAGE 2: Setup ###
FROM nginx:alpine
## Copy our default nginx config
COPY nginx/default.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*
## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /ng-app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]





# FROM node:10.15-alpine

# WORKDIR /usr/src/application

# COPY package*.json ./
# RUN apk --no-cache add --virtual git && npm install 


# # Bundle app source
# COPY . .

# EXPOSE 8080
# CMD [ "npm", "run", "serve" ]


