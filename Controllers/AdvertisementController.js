const router = require('express').Router();
const FactoryContainer = require('../Factory/FactoryContainer');
const {FactoryResolveType} = require('../Enum/FactoryResolveType');

const _adsService = FactoryContainer.Resolve(FactoryResolveType.ADVERTISEMENT_SERVICE, true);

router.get('/getHorizondalAds/:FileUsageType/:ReferenceID', async (req, res)=>{
    const ads = await _adsService.getHorizondalAds(req.params.FileUsageType, req.params.ReferenceID);
    res.send(ads);
});

module.exports = router;