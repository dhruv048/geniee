FROM launcher.gcr.io/google/nodejs
RUN install_node v4.8.2
COPY . /app/
RUN (cd programs/server && npm install --unsafe-perm)
CMD node main.js