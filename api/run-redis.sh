#!/bin/bash
# This script downloads and runs redis-server.
# If redis has been already downloaded, it just runs it
if [ ! -d redis-stable/src ]; then
    curl -O http://download.redis.io/redis-stable.tar.gz
    tar xvzf redis-stable.tar.gz
    rm redis-stable.tar.gz
    cd redis-stable
    make
else
    cd redis-stable
fi
src/redis-server