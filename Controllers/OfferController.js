const router = require('express').Router();
const FactoryContainer = require('../Factory/FactoryContainer');
const {FactoryResolveType} = require('../Enum/FactoryResolveType');

const _offerService = FactoryContainer.Resolve(FactoryResolveType.OFFER_SERVICE, true);
const _paginationService = FactoryContainer.Resolve(FactoryResolveType.PAGINATION_SERVICE, false);

router.get('/getAll', async (req, res)=>{
    const offer = await _offerService.getAll();
    res.send(offer);
});

router.post('/getAllFiltered', async (req, res)=>{
    const offers = await _offerService.getAllFiltered(req.body);
    res.send(_paginationService.BuildPaginationResponse(offers, req.body));
});

router.get('/mostRecentOffers', async (req, res)=>{
    const data = await _offerService.getMostRecentOffers();
    res.send(data);
});

router.get('/mostPopularOffers', async (req, res)=>{
    const data = await _offerService.getMostPopularOffers();
    res.send(data);
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

router.delete('/removeOfferByBrandID/:BrandID', async (req, res)=>{
    await _offerService.removeOfferByBrandID(req.params.BrandID);
    res.send();
});

router.put('/updateOfferViews/:OfferID/:ClientID', async (req, res)=>{
    await _offerService.updateOfferViews(req.params.OfferID, req.params.ClientID);
    res.send();
});

module.exports = router;