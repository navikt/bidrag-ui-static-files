FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim
WORKDIR /app
COPY build ./build
ENV NODE_ENV=production
EXPOSE 8080
CMD ["build/index.js"]
