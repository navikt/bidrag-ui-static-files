FROM node:16-slim

COPY /build ./build

EXPOSE 8080

CMD ["./build/index.js"]
