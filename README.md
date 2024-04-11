# Deadline Web App Frontend

**Meet the BreakTools Deadline Web App, the all in one render farm monitor made for artists on the go. Click [here](https://monitor.breaktools.info/) to see it working in action!**
![WebAppPromo](https://github.com/BreakTools/deadline-web-app-frontend/assets/63094424/38836cfb-f123-4d0f-8606-1a58bfd2721f)

# Features

## Monitor jobs in one clean overview.

Deadline's own monitor program is powerful but overwhelming. Most artist just want to see how their renders are progressing without getting lost in all the technical details.
![compare1](https://github.com/BreakTools/deadline-web-app-frontend/assets/63094424/1704ac7b-7051-4d73-be1a-90714738c6fb)


## Get job data with a little help from ChatGPT.

Whenever your job encounters an error, ChatGPT will read the error logs for you and provide you with a readable summary.
<p align="center">
  <img src="https://github.com/BreakTools/deadline-web-app-frontend/assets/63094424/09b03765-346d-4222-bb93-99d825f90534" />
</p>

## Previews frames as compressed JPEGs

You can click on a finished frame to download a JPEG preview.

<p align="center">
  <img src="https://github.com/BreakTools/deadline-web-app-frontend/assets/63094424/99dc950b-08a2-4289-bccb-a78ec7f79e08" />
</p>


## Mobile friendly design
Monitor your render jobs from anywhere right on your phone.

<p align="center">
  <img src="https://github.com/BreakTools/deadline-web-app-frontend/assets/63094424/4571b4fd-38dd-4210-8c53-4243f7cf8a43" />
</p>

# Installation instructions (Docker)
Unfortunately I can't provide a built image due to how NextJS generates static HTML at build time, which has to include the backend WebSocket URL. I've provided a docker-compose file so you can easily build and run the image yourself.
1. Make sure you have the [backend for this frontend](https://github.com/BreakTools/deadline-web-app-backend) running. 
2. Clone this repository.
```
git clone https://github.com/BreakTools/deadline-web-app-frontend
```
3. Navigate into the deadline-web-app-frontend directory.
```
cd deadline-web-app-frontend
```
4. Open `docker-compose.yml` and change the NEXT_PUBLIC_BACKEND_URL arg to the URL of your running WebSocket backend. Feel free to change the container port as well.
5. Build and run the Docker container.
```
docker compose up
```
That's it! The frontend is now running. Make sure to put this webserver behind a domain name with SSL, otherwise the desktop notifications won't work.

# Installation instructions (Standalone)
1. Make sure you have the [backend for this frontend](https://github.com/BreakTools/deadline-web-app-backend) running. 
2. Make sure you have a recent version of NodeJS installed.
3. Download this repository, put it in a good spot and cd into it. Run `npm install` to download all needed Node packages.
4. Create and open `.env.local`, add a NEXT_PUBLIC_BACKEND_URL and set it to the URL of your running WebSocket backend.
5. Run `npm run build`, then run `npm run start` to start the webserver.

That's it! Make sure to put this webserver behind a domain name with SSL, otherwise the desktop notifications won't work.
