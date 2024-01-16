const router = require('express').Router();
const FactoryContainer = require('../Factory/FactoryContainer');
const {FactoryResolveType} = require('../Enum/FactoryResolveType');

const _brandService = FactoryContainer.Resolve(FactoryResolveType.BRAND_SERVICE, true);

router.get('/getAll', async (req, res)=>{
    const brand = await _brandService.getAll();
    res.send(brand);
});

router.get('/:id', async (req, res)=>{
    const brand = await _brandService.getBrand(req.params.id);
    res.send(brand);
});

router.get('/getBrandIdByUserId/:id', async (req, res)=>{
    const brand = await _brandService.getBrandIdByUserId(req.params.id);
    res.send(brand);
});

router.post('/createBrand', async (req, res)=>{
    const id = await _brandService.createBrand(req.body);
    res.send(id);
});

router.put('/updateBrand', async (req, res)=>{
    await _brandService.updateBrand(req.body);
    res.send();
});

router.delete('/removeBrand/:id', async (req, res)=>{
    await _brandService.removeBrand(req.params.id);
    res.send();
});

module.exports = router;