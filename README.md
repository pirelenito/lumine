# Lumine

A stateless photo library service to run on your NAS.

Just point the service to a folder and browse away! No vendor lock-in, no databases ✨.

It supports:

- RAW formats 📸
- Video files 📹
- Screenshots 🖥

![Screenshot](screenshot.png)

Still very much a work-in-progress 🙈.

## Setup

The easiest way to get Lumine running is using Docker with the pre-built [Docker image](https://hub.docker.com/repository/docker/pirelenito/lumine).

The image expects two volumes:

- `/data/cache`: temporary storage for thumbnails and metadata extracted from the photos. **Needs writing permission**.
- `/data/masters`: location of the original files to show in the library. **Should be read-only**.

Here is an example (replace with paths to your local file-system):

```bash
docker run -ti -v /Users/paulo/lumine-cache:/data/cache -v /Users/paulo/Pictures:/data/masters:ro -p 0.0.0.0:80:80 pirelenito/lumine:latest
```

## Development

Lumine has a dependency to ImageMagick, therefore is recommended to use docker-compose in development.

Install dependencies:

```
docker-compose run client yarn
```

Start development servers:

```
docker-compose up
```

It starts two servers:

- Frontend: `localhost:3000`
- Backend: `localhost:8080`
