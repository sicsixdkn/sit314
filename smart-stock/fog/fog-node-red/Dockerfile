# Use the official Node-RED Docker image as the base
FROM nodered/node-red:latest

# Install required libraries
RUN npm install --unsafe-perm node-red-contrib-coap node-red-contrib-mongodb4
RUN npm install elliptic

# Copy Node-RED flows and settings (flows and settings were exported from a configured local Node-RED instance)
COPY ./flows.json /data/flows.json
COPY ./settings.js /data/settings.js

# Add the fixed mongodb4.js file to the container. Had to manually fix an issue where the mongodb4 node would not
# connect to the MongoDB server on first run until manually redeployed, kind of useless as a container if it can't
# connect on first run.
# Ideally this should be fixed in the node-red-contrib-mongodb4 package itself, but this lets me get around it for now.
COPY ./mongodb4.js /usr/src/node-red/node_modules/node-red-contrib-mongodb4/src/mongodb4.js

# Expose the default Node-RED port and CoAP port 5683
EXPOSE 1880
EXPOSE 5683/udp

# Environment variables for the MongoDB and Cloud server
ENV MONGO_PROTOCOL="mongodb+srv"
ENV MONGO_URI="sit314.okntx.mongodb.net"
ENV MONGO_PORT=""
# NOTE: Swapping CLOUD_URI for the ENV variable inside URL of HTTP nodes is broken in Node-RED, I've hardcoded it in the
# flows.json instead.
ENV CLOUD_URI="http://34.203.203.24"
ENV MONGO_USERNAME="s222177103"
ENV MONGO_PASSWORD="OPkr3ZdpGQRu0JFf"

# Start Node-RED
CMD ["npm", "start", "--", "--userDir", "/data"]
