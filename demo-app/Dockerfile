FROM nginx

MAINTAINER "Fatih Ulusoy" <ulusoy@de.ibm.com>

ADD package.json /iot4i-starter-app/
WORKDIR /iot4i-starter-app

# Install NodeJs-6
RUN apt-get update
RUN apt-get install -y sudo curl git gnupg2
RUN curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
RUN apt-get install -y nodejs

RUN npm install -g bower
RUN npm install -g brunch
RUN npm install

ADD bower.json /iot4i-starter-app/
RUN bower install --allow-root

ADD . /iot4i-starter-app

RUN brunch build --production
RUN cp -a ./public/. /usr/share/nginx/html/

# expose both the HTTP (80) and HTTPS (443) ports
EXPOSE 80 443
