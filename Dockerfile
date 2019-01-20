FROM node
MAINTAINER zyhua

ADD . /home/app
WORKDIR /home/app
RUN npm install yarn -g
RUN yarn
EXPOSE 8999
EXPOSE 9999
EXPOSE 27000
EXPOSE 6300
#程序启动脚本
CMD ["npm", "start"]