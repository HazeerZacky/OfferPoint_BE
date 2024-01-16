const router = require('express').Router();
const FactoryContainer = require('../Factory/FactoryContainer');
const {FactoryResolveType} = require('../Enum/FactoryResolveType');

const _userService = FactoryContainer.Resolve(FactoryResolveType.USER_SERVICE, true);

router.get('/getAll', async (req, res)=>{
    const user = await _userService.getAll();
    res.send(user);
});

router.get('/:id', async (req, res)=>{
    const user = await _userService.getUser(req.params.id);
    res.send(user);
});

router.post('/registerBrandUser', async (req, res)=>{
    const id = await _userService.registerBrandUser(req.body);
    res.send(id);
});

router.post('/createUser', async (req, res)=>{
    const id = await _userService.createUser(req.body);
    res.send(id);
});

router.put('/updateUser', async (req, res)=>{
    await _userService.updateUser(req.body);
    res.send();
});

router.delete('/removeUser/:id', async (req, res)=>{
    await _userService.removeUser(req.params.id);
    res.send();
});

router.post('/loginUser', async (req, res)=>{
    const user = await _userService.loginUser(req.body);
    res.send(user);
});

module.exports = router;