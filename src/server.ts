import http from 'http';
import express from 'express';
import { logging, config } from '@config';

const NAMESPACE = 'SERVER';

const router = express();

/** Logging the request * */
router.use((req, res, next) => {
    logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}] , IP - [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}] , IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`);
    });
});

//! Middle parse data
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

/** Rules of our API * */
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

/** Routes * */

/** Error Handling * */
router.use((req, res) => {
    const error = new Error('not found');

    return res.status(404).json({
        message: error.message,
    });
});

/** Create the server * */
const httpServer = http.createServer(router);
httpServer.listen(config.server.PORT, () => {
    logging.info(NAMESPACE, `Server running on ${config.server.hostname}:${config.server.PORT}`);
});
