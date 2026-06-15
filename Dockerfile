FROM node:24-slim

COPY /build ./build

EXPOSE 8080

CMD ["./build/index.js"]
