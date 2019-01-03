FROM node
RUN mkdir -p /home/koa
WORKDIR /home/koa
COPY package.json /home/koa
COPY config.json /home/koa
RUN npm install
COPY dist /home/koa
EXPOSE 8999 9999