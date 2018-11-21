# Lumine server

Types of media:

- jpep
- raw
- video

## Architecture

We need to separate it in a couple of steps:

And ideally we should have some caching involved.

### Discoverability

What identifies an image? Is its path? What if I move them around?

So the idea is that we point the server to a folder, and it discovers all the images in it.

I guess it should be the path? But we can group them by the hash?

- path

### Optimisation

- Generate thumbnail

### Identification

- content hash
- exif metadata (gps, size, camera, etc, dates)
- file metadata (dates)

## Database

Where and how should we store the data? Should we just use the filesystem and in-memory? Will we need some query language?
