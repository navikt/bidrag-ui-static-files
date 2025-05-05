FROM node:22-slim

COPY /build ./build

EXPOSE 8080

CMD ["./build/index.js"]
