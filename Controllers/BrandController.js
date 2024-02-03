const router = require('express').Router();
const FactoryContainer = require('../Factory/FactoryContainer');
const {FactoryResolveType} = require('../Enum/FactoryResolveType');

const _brandService = FactoryContainer.Resolve(FactoryResolveType.BRAND_SERVICE, true);
const _paginationService = FactoryContainer.Resolve(FactoryResolveType.PAGINATION_SERVICE, false);

router.get('/getAll', async (req, res)=>{
    const brand = await _brandService.getAll();
    res.send(brand);
});

router.post('/getAllFiltered', async (req, res)=>{
    const brand = await _brandService.getAllFiltered(req.body);
    res.send(_paginationService.BuildPaginationResponse(brand, req.body));
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

router.delete('/removeAllBrandSubUsers/:BrandID', async (req, res)=>{
    await _brandService.removeAllBrandSubUsers(req.params.BrandID);
    res.send();
});

router.delete('/removeBrandSubUserByUserID/:UserID', async (req, res)=>{
    await _brandService.removeBrandSubUserByUserID(req.params.UserID);
    res.send();
});

router.get('/IsVerifiedBrand/:BrandID', async (req, res)=>{
    const brand = await _brandService.IsVerifiedBrand(req.params.BrandID);
    res.send(brand);
});

module.exports = router;