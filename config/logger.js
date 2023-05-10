import { format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs'
import { readFile, writeFile, appendFile, mkdir } from "fs/promises";

import { dirname } from 'path';
import path from 'path';
const __dirname = path.resolve();

const fsPromises = 'fs'.promises



export const logEvents = async (message, logFileName) => {
    const dateTime = format(new Date(), 'yyyy:MM:dd\tHH:mm:ss')
    const logItem = `${dateTime}\t${uuidv4()}\t${message}\n`

    try {
        if (!fs.existsSync(path.join(__dirname, '.', 'logs'))) {
            await mkdir(path.join(__dirname, '.', 'logs'))
        }
        await appendFile(path.join(__dirname, '.', 'logs', logFileName), logItem)
    } catch (err) {
        console.log(err)
    }
}

export const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
    console.log(`${req.method} ${req.path}`)
    next()
}
