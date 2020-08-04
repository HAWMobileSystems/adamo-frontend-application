
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

## Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*
COPY ./nginx/default.conf /etc/nginx/nginx.conf

COPY --from=builder /ng-app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
EXPOSE 80



# RUN echo "mainFileName=\"\$(ls /usr/share/nginx/html/main*.js)\" && \
#          envsubst '\$BACKEND_API_URL \$DEFAULT_LANGUAGE ' < \${mainFileName} > main.tmp && \
#          mv main.tmp  \${mainFileName} && nginx -g 'daemon off;'" > run.sh

#ENTRYPOINT ["sh", "run.sh"]
