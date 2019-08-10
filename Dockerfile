# ------ build client ------

FROM node:10.13.0 AS client

RUN mkdir -p /usr/src/app/client
WORKDIR /usr/src/app/client

COPY client /usr/src/app/client/
RUN yarn install && yarn cache clean --force
RUN yarn build

# ------ build service ------

FROM pirelenito/node-ffmpeg-imagemagick:latest

RUN mkdir -p /usr/src/app/server
WORKDIR /usr/src/app/server

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY server/package.json /usr/src/app/server/
COPY server/yarn.lock /usr/src/app/server/
RUN yarn install && yarn cache clean --force
COPY server /usr/src/app/server

RUN mkdir -p /usr/src/app/client/build
COPY --from=client /usr/src/app/client/build /usr/src/app/client/build

EXPOSE 80

# read-only folder containing all the photos
VOLUME /data/masters

# writeable directory used to store cached assets
VOLUME /data/cache

CMD [ "yarn", "start" ]
