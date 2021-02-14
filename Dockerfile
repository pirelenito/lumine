FROM pirelenito/node-ffmpeg-imagemagick:latest

RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app/

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY client/package.json /usr/src/app/client/
COPY server/package.json /usr/src/app/server/
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/

RUN yarn install && yarn cache clean --force
COPY . /usr/src/app/

RUN cd client && yarn build

EXPOSE 80

# read-only folder containing all the photos
VOLUME /data/masters

# writeable directory used to store cached assets
VOLUME /data/cache

WORKDIR /usr/src/app/server/

CMD [ "yarn", "start" ]
