docker login registry.gitlab.com
docker build -t registry.gitlab.com/ipim/adamo-frontend-application .
docker push registry.gitlab.com/ipim/adamo-frontend-application