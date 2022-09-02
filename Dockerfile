FROM gcr.io/distroless/nodejs@sha256:6b2a243b543dbdb919977ceb43c7f7bf090ce66f02d1f12780fe52037f1bdc15

COPY /build ./build

EXPOSE 8080

CMD ["./build/index.js"]
