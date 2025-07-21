// backend/routes/matchRoutes.js
const express = require('express');
const router = express.Router();
const { unpinMatch } = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:id/unpin', protect, unpinMatch);

module.exports = router;