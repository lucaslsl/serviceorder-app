FROM nginx:1.13.5-alpine
RUN apk add --no-cache unzip
ENV VERSION 0.0.1
RUN mkdir www
ADD https://github.com/lucaslsl/serviceorder-app/releases/download/v0.0.1/serviceorder-app-0.0.1.zip /www/
WORKDIR www
RUN unzip serviceorder-app-0.0.1.zip
RUN mv serviceorder-app-0.0.1/dist static
ADD nginx.conf /etc/nginx/nginx.conf
ADD nginx-badbot-blocker/blacklist.conf /etc/nginx/blacklist.conf
ADD nginx-badbot-blocker/blockips.conf /etc/nginx/blockips.conf

CMD ["nginx", "-g", "daemon off; error_log stderr info;"]