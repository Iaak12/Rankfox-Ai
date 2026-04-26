const express = require('express');
const router = express.Router();
const { getUsers, getContacts, toggleAccess } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/users', protect, admin, getUsers);
router.get('/contacts', protect, admin, getContacts);
router.put('/users/access/:id', protect, admin, toggleAccess);

module.exports = router;
