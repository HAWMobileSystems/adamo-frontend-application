
FROM node:10 as builder
WORKDIR /ng-app
COPY package.json package-lock.json ./
RUN npm ci
# RUN mkdir /ng-app
# RUN mv ./node_modules ./ng-app
COPY . .
RUN npm run docker:build:dev

### STAGE 2: Setup ###
FROM nginx:alpine
COPY nginx/default.conf /etc/nginx/conf.d/

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /ng-app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]


