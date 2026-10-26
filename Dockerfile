FROM gcr.io/distroless/nodejs24-debian12:nonroot
WORKDIR /app
COPY build ./build
ENV NODE_ENV=production
EXPOSE 8080
CMD ["build/index.js"]
