FROM node:18-slim

COPY /build ./build

EXPOSE 8080

CMD ["./build/index.js"]
