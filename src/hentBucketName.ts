import { logger } from './logger'

export function hentBucketName() {
    const bucketname = process.env.BUCKET_NAME
    if (bucketname) {
        return bucketname as string
    }
    logger.error('Mangler miljøvariabel BUCKET_NAME')
    process.exit(-1)
}
