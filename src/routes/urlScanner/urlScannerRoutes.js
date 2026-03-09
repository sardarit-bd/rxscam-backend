import express from 'express';
import urlScannerController from '../../controllers/urlScanner/urlScannerController.js';

const router = express.Router();

router.post('/v1/free/url-scan', urlScannerController.scanURL.bind(urlScannerController));

export default router;