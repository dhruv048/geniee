FROM launcher.gcr.io/google/nodejs
RUN install_node v12.14.0
COPY . /app/
RUN (cd programs/server && npm install --unsafe-perm)
CMD node main.js