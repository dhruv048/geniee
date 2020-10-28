FROM launcher.gcr.io/google/nodejs
RUN install_node v12.16.1
COPY . /app/
# RUN (cd programs/server && npm install --unsafe-perm)
RUN (cd programs/server && npm install --production)
CMD node main.js