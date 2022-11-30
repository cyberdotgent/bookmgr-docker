# IBM BookManager BookServer 2.3 Docker Container

This is a Docker container that contains the IBM BookManager BookServer 2.3 CGI application (see https://www.ibm.com/common/ssi/cgi-bin/ssialias?subtype=ca&infotype=an&appname=iSource&supplier=897&letternum=ENUS201-273).

## Usage 
 
A sample .BOO book is included in the sample_books directory. Make sure to mount it at the /books directory when running the container. Other .BOO files need to be placed here too.

    docker pull ghcr.io/cyberdotgent/bookmgr-docker:main
    docker run -p3000:3000  -v REPO_PATH/sample_books:/books ghcr.io/cyberdotgent/bookmgr-docker:main

## Building

    docker build . -t bookmgr

