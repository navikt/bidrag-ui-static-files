import pino from 'pino'


const createBackendLogger = (): pino.Logger =>
    pino({
        timestamp: pino.stdTimeFunctions.isoTime,
        formatters: {
            level: (label) => {
                return { level: label.toUpperCase() }
            },
        },
    })

export const logger = createBackendLogger()
