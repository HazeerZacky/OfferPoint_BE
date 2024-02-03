const router = require('express').Router();
const FactoryContainer = require('../Factory/FactoryContainer');
const {FactoryResolveType} = require('../Enum/FactoryResolveType');

const _categoryService = FactoryContainer.Resolve(FactoryResolveType.CATEGORY_SERVICE, true);
const _paginationService = FactoryContainer.Resolve(FactoryResolveType.PAGINATION_SERVICE, false);


router.get('/getAll', async (req, res)=>{
    const data = await _categoryService.GetAll();
    res.send(data);
});

router.get('/getAllCategoryAsKeyValue', async (req, res)=>{
    const data = await _categoryService.getAllCategoryAsKeyValue();
    res.send(data);
});

router.get('/:id', async (req, res)=>{
    const category = await _categoryService.getCategory(req.params.id);
    res.send(category);
});

router.post('/createCategory', async (req, res)=>{
    const id = await _categoryService.createCategory(req.body);
    res.send(id);
});

router.put('/updateCategory', async (req, res)=>{
    await _categoryService.updateCategory(req.body);
    res.send();
});

router.delete('/removeCategory/:id', async (req, res)=>{
    await _categoryService.removeCategory(req.params.id);
    res.send();
});

router.post('/getAllFiltered', async (req, res)=>{
    const category = await _categoryService.getAllFiltered(req.body);
    res.send(_paginationService.BuildPaginationResponse(category, req.body));
});

module.exports = router;