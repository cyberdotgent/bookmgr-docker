# IBM BookManager BookServer 2.3 Docker Container

This is a Docker container that contains the IBM BookManager BookServer 2.3 CGI application (see https://www.ibm.com/common/ssi/cgi-bin/ssialias?subtype=ca&infotype=an&appname=iSource&supplier=897&letternum=ENUS201-273).

## Usage 

    docker run -p3000:3000 bookmgr 

## Building

    docker build . -t bookmgr

