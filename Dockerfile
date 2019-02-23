FROM alpine

RUN apk add build-base gcc abuild autoconf automake binutils binutils-doc gcc-doc git

RUN git clone https://github.com/vgropp/bwm-ng.git

RUN cd bwm-ng && ./autogen.sh && ./configure && make

FROM node:alpine

RUN npm init -y && npm install mqtt

COPY --from=0 /bwm-ng/src/bwm-ng .
COPY index.js .

CMD node index.js
