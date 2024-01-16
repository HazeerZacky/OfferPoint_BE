const router = require('express').Router();
const FactoryContainer = require('../Factory/FactoryContainer');
const {FactoryResolveType} = require('../Enum/FactoryResolveType');

const _offerService = FactoryContainer.Resolve(FactoryResolveType.OFFER_SERVICE, true);

router.get('/getAll', async (req, res)=>{
    const offer = await _offerService.getAll();
    res.send(offer);
});

router.post('/getAllFiltered', async (req, res)=>{
    const offers = await _offerService.getAllFiltered(req.body);
    res.send(offers);
});

router.get('/:id', async (req, res)=>{
    const offer = await _offerService.getOffer(req.params.id);
    res.send(offer);
});

router.post('/createOffer', async (req, res)=>{
    const id = await _offerService.createOffer(req.body);
    res.send(id);
});

router.put('/updateOffer', async (req, res)=>{
    await _offerService.updateOffer(req.body);
    res.send();
});

router.delete('/removeOffer/:id', async (req, res)=>{
    await _offerService.removeOffer(req.params.id);
    res.send();
});

module.exports = router;