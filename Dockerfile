# ------ build client ------

FROM node:9.2.0 AS client

RUN mkdir -p /usr/src/app/client
WORKDIR /usr/src/app/client

COPY client /usr/src/app/client/
RUN npm install && npm cache clean --force
RUN npm run dist

# ------ build service ------

FROM node:9.2.0

# ImageMagick installation adapted from:
# - https://hub.docker.com/r/starefossen/node-imagemagick/~/dockerfile/
# - http://www.imagemagick.org/script/advanced-unix-installation.php#configure

ENV MAGICK_URL "http://imagemagick.org/download/releases"
ENV MAGICK_VERSION 7.0.7-11

RUN gpg --keyserver pool.sks-keyservers.net --recv-keys 8277377A \
  && apt-get update -y \
  && apt-get install -y --no-install-recommends \
    libpng-dev libjpeg-dev libtiff-dev libopenjpeg-dev ufraw-batch \
  && apt-get remove -y imagemagick \
  && cd /tmp \
  && curl -SLO "${MAGICK_URL}/ImageMagick-${MAGICK_VERSION}.tar.xz" \
  && curl -SLO "${MAGICK_URL}/ImageMagick-${MAGICK_VERSION}.tar.xz.asc" \
  && gpg --verify "ImageMagick-${MAGICK_VERSION}.tar.xz.asc" "ImageMagick-${MAGICK_VERSION}.tar.xz" \
  && tar xf "ImageMagick-${MAGICK_VERSION}.tar.xz" \

  && cd "ImageMagick-${MAGICK_VERSION}" \
  && ./configure \
    --disable-static \
    --enable-shared \
    --with-jpeg \
    --with-jp2 \
    --with-openjp2 \
    --with-png \
    --with-tiff \
    --with-quantum-depth=8 \
    --without-x \

  && make \
  && make install \
  && ldconfig /usr/local/lib \

  && apt-get -y autoclean \
  && apt-get -y autoremove \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN mkdir -p /usr/src/app/server
WORKDIR /usr/src/app/server

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY server/package.json /usr/src/app/server/
COPY server/package-lock.json /usr/src/app/server/
RUN npm install && npm cache clean --force
COPY server /usr/src/app/server

COPY --from=client /usr/src/app/client/dist /usr/src/app/client/dist

EXPOSE 80

# read-only folder containing all the photos
VOLUME /data/masters

# writeable directory used to store cached assets
VOLUME /data/cache

CMD [ "npm", "start" ]
