const router = require('express').Router();
const FactoryContainer = require('../Factory/FactoryContainer');
const {FactoryResolveType} = require('../Enum/FactoryResolveType');

const _userService = FactoryContainer.Resolve(FactoryResolveType.USER_SERVICE, true);
const _paginationService = FactoryContainer.Resolve(FactoryResolveType.PAGINATION_SERVICE, false);

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

router.post('/createContactMessage', async (req, res)=>{
    const id = await _userService.createContactMessage(req.body);
    res.send(id);
});

router.delete('/removeContactMessage/:id', async (req, res)=>{
    await _userService.removeContactMessage(req.params.id);
    res.send();
});

router.post('/getAllFilteredContactMessage', async (req, res)=>{
    const message = await _userService.getAllFilteredContactMessage(req.body);
    res.send(_paginationService.BuildPaginationResponse(message, req.body));
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
    if(user){
        if(user.IsActive != 1){
            res.send({message :'InActive user.'});
        }else{
            res.send(user);
        }
    }
    else{
        res.send(user);
    }
    
});

router.post('/getAllFiltered', async (req, res)=>{
    const user = await _userService.getAllFiltered(req.body);
    res.send(_paginationService.BuildPaginationResponse(user, req.body));
});

router.post('/linkBrandSubUser/:UserID/:BrandID', async (req, res)=>{
    const user = await _userService.linkBrandSubUser(req.params.UserID, req.params.BrandID);
    res.send(user);
});

module.exports = router;