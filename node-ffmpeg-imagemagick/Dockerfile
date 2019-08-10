FROM node:10.16.2-buster

RUN apt-get update -y

RUN apt-get install -y ffmpeg libavcodec-extra58

# ImageMagick installation adapted from:
# - https://raw.githubusercontent.com/Starefossen/docker-node-imagemagick/master/5-6/Dockerfile
# - http://www.imagemagick.org/script/advanced-unix-installation.php#configure

ENV MAGICK_URL "http://imagemagick.org/download/releases"
ENV MAGICK_VERSION 7.0.8-59
ENV GPG_KEY 8277377A

RUN apt-get install -y --no-install-recommends \
  libpng-dev libjpeg-dev libtiff-dev libopenjp2-7-dev \
  && apt-get remove -y imagemagick \
  && cd /tmp \
  && curl -SLO "${MAGICK_URL}/ImageMagick-${MAGICK_VERSION}.tar.xz" \
  && curl -SLO "${MAGICK_URL}/ImageMagick-${MAGICK_VERSION}.tar.xz.asc" \
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

