FROM node:8

ENV HOME /opt/bfe
ENV REPO https://github.com/sul-dlss/bfe.git

WORKDIR $HOME

RUN apt-get update && git clone --depth 3 $REPO $HOME && \
  cd $HOME && rm $HOME/static/js/config-dev.js

COPY bfe-config.js $HOME/static/js/config-dev.js

RUN npm i npm@latest -g && \
  npm install -g && \
  npm install --save body-parser && \
  rm index.html && cp development.html index.html

CMD ["node", "server-bfe.js"]
