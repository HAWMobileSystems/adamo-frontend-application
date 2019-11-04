
FROM node:10-alpine as builder
RUN apk add --no-cache git
COPY package.json package-lock.json ./
RUN yarn && mkdir /ng-app && mv ./node_modules ./ng-app
WORKDIR /ng-app
COPY . .
RUN yarn docker:build:dev

### STAGE 2: Setup ###
FROM nginx:alpine
COPY nginx/default.conf /etc/nginx/conf.d/

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /ng-app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]


