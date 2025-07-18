FROM node:lts-buster

RUN apt-get update && \
  apt-get install -y \  
  && \
  apt-get upgrade -y && \
  rm -rf /var/lib/apt/lists/*

COPY package.json .

RUN npm install

COPY . .

EXPOSE 80

CMD ["node", "index"]