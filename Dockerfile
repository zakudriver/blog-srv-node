FROM node
MAINTAINER zyhua

RUN mkdir -p /home/app  
WORKDIR /home/app
COPY . /home/app
RUN npm install yarn -g
# RUN yarn global add pm2
RUN yarn
EXPOSE 8999
EXPOSE 7999

#程序启动脚本
CMD ["npm", "start"]
