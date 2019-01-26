# ------ build client ------

# FROM node:10.13.0 AS client

# RUN mkdir -p /usr/src/app/client
# WORKDIR /usr/src/app/client

# COPY client /usr/src/app/client/
# RUN yarn install && yarn cache clean --force
# RUN yarn build

# ------ build service ------

FROM node:10.13.0-jessie

# ImageMagick installation adapted from:
# - https://raw.githubusercontent.com/Starefossen/docker-node-imagemagick/master/5-6/Dockerfile
# - http://www.imagemagick.org/script/advanced-unix-installation.php#configure

ENV MAGICK_URL "http://imagemagick.org/download/releases"
ENV MAGICK_VERSION 7.0.8-24
ENV GPG_KEY 8277377A

RUN apt-get update -y \
  && apt-get install -y --no-install-recommends \
  libpng-dev libjpeg-dev libtiff-dev libopenjpeg-dev \
  && apt-get remove -y imagemagick \
  && cd /tmp \
  && curl -SLO "${MAGICK_URL}/ImageMagick-${MAGICK_VERSION}.tar.xz" \
  && curl -SLO "${MAGICK_URL}/ImageMagick-${MAGICK_VERSION}.tar.xz.asc" \
  && (gpg --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys "$GPG_KEY" || gpg --keyserver hkp://ipv4.pool.sks-keyservers.net --recv-keys "$GPG_KEY" || gpg --keyserver hkp://pgp.mit.edu:80 --recv-keys "$GPG_KEY") \
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
  --without-magick-plus-plus \
  --without-bzlib \
  --without-zlib \
  --without-dps \
  --without-fftw \
  --without-fpx \
  --without-djvu \
  --without-fontconfig \
  --without-freetype \
  --without-jbig \
  --without-lcms \
  --without-lcms2 \
  --without-lqr \
  --without-lzma \
  --without-openexr \
  --without-pango \
  --without-webp \
  --without-x \
  --without-xml \
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
COPY server/yarn.lock /usr/src/app/server/
RUN yarn install && yarn cache clean --force
COPY server /usr/src/app/server

# COPY --from=client /usr/src/app/client/dist /usr/src/app/client/dist

EXPOSE 80

# read-only folder containing all the photos
VOLUME /data/masters

# writeable directory used to store cached assets
VOLUME /data/cache

CMD [ "yarn", "start" ]
