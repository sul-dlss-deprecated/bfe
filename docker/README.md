# Running Editor with Docker
To run the `bfe` editor as a Docker image, follow these steps.

1.  Build and tag the image: `docker build -t sul-dlss/bfe .`

1.  Run the image with an open port 8000 in the foreground:
    `docker run -p 8000:8000 --name bfe --rm --pid=host sul-dlss/bfe`

    **NOTE:** `--pid=host` is needed to shutdown the container if running in the 
    foreground. 
