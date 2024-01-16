const router = require('express').Router();
const authService = require('../Services/authService');

router.get('/', (req, res)=>{
    const data = authService.getUser();
    res.send(data);
});

module.exports = router;