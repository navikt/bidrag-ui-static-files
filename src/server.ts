import express from 'express'
import cors from 'cors'
import { Storage } from '@google-cloud/storage'
import { logger } from './logger'
import { InMemFile, FileCache } from './types'
import { hentBucketName } from './hentBucketName'
import { collectDefaultMetrics, register } from 'prom-client'
import { cacheHitCounter, cacheMissCounter, errorCounter, notFoundCounter, successCounter } from './metrics'

const app = express()
const port = 8080
const storage = new Storage()
const bucketName = hentBucketName()
const bucket = storage.bucket(bucketName)
const cache: FileCache = {}
const cacheFlushInterval = 60 * 60 * 1000 // 1 time i millisekunder
const noCacheFileNames = new Set([ 'remoteEntry.js', 'manifest.tsv' ])
const defaultContentType = 'application/octet-stream'

const isHttpErrorWithCode = (error: unknown): error is { code: number } =>
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'number'

const shouldSkipCache = (filename: string): boolean =>
    Array.from(noCacheFileNames).some((noCacheFileName) =>
        filename === noCacheFileName || filename.endsWith(`/${noCacheFileName}`))

collectDefaultMetrics()
// app.use(cors({ origin: '*' }))
app.use(cors({ origin: /\.nav\.no$/ }))

app.set('x-powered-by', false)

app.get('/', (req, res) => {
    res.send('I am bidrag ui static files')
})
app.get('/robots.txt', (req, res) => {
    res.header('Content-Type', 'text/plain')
    res.send('User-agent: *\nDisallow: /')
})
app.get('/favicon.ico', (req, res) => {
    res.sendStatus(404)
})
app.get('/internal/health', async(req, res) => {
    res.sendStatus(200)
})
app.get('/internal/prometheus', async(req, res) => {
    res.set('Content-Type', register.contentType)
    res.end(await register.metrics())
})

app.get('/*default', async(req, res) => {
    let filnavn = ''

    try {
        filnavn = decodeURI(req.path.slice(1))
        const shouldNotCacheFile = shouldSkipCache(filnavn)

        const sendFil = (file: InMemFile) => {
            res.contentType(file.contentType)
            res.setHeader('cache-control', shouldNotCacheFile ? 'no-cache, no-store, must-revalidate' : 'public, max-age=31536000, immutable')
            res.send(file.content)
            successCounter.inc()
        }
        const fil = shouldNotCacheFile ? undefined : cache[filnavn]
        if (fil) {
            sendFil(fil)
            cacheHitCounter.inc()
            return
        }

        cacheMissCounter.inc()
        logger.info(`Henter ${filnavn} fra bucket ${bucketName}`)

        const file = bucket.file(filnavn)
        const [ metadata ] = await file.getMetadata()
        const contentType = metadata.contentType ?? defaultContentType

        if (shouldNotCacheFile) {
            res.contentType(contentType)
            res.setHeader('cache-control', 'no-cache, no-store, must-revalidate')
            file.createReadStream()
                .on('error', (error: unknown) => {
                    if (isHttpErrorWithCode(error) && error.code === 404) {
                        logger.warn(`404: ${filnavn}`)
                        res.sendStatus(404)
                        notFoundCounter.inc()
                    } else {
                        logger.error({ msg: `Feil ved henting av ${filnavn}`, err: error })
                        res.sendStatus(500)
                        errorCounter.inc()
                    }
                })
                .pipe(res)
            successCounter.inc()
            return
        }

        const [ content ] = await file.download()
        const hentetFil: InMemFile = { content, contentType }
        cache[filnavn] = hentetFil
        sendFil(hentetFil)
    } catch (error: unknown) {
        if (isHttpErrorWithCode(error) && error.code === 404) {
            logger.warn(`404: ${filnavn}`)
            res.sendStatus(404)
            notFoundCounter.inc()
        } else {
            logger.error({ msg: `Feil ved henting av ${filnavn}`, err: error })
            res.sendStatus(500)
            errorCounter.inc()
        }
    }
})

setInterval(() => {
    logger.info('Flusher cache')
    for (const member in cache) {
        logger.info(`Fjerner ${member} fra cache`)
        delete cache[member]
    }

}, cacheFlushInterval)

app.listen(port, () => logger.info(`Bidrag ui static files lytter på ${port}!`))
