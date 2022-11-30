FROM ubuntu:22.04
EXPOSE 3000


RUN dpkg --add-architecture i386
RUN apt update -y && apt upgrade -y

RUN apt install -y zlib1g:i386 lighttpd

COPY bookmgr /bookmgr
COPY run.sh /run.sh
COPY lighttpd.conf /lighttpd.conf

RUN ln -s /bookmgr /var/www/html/bookmgr
RUN rm /var/www/html/index.lighttpd.html
RUN mkdir /books 

CMD ["/run.sh"]
