const router = require('express').Router();
const FactoryContainer = require('../Factory/FactoryContainer');
const {FactoryResolveType} = require('../Enum/FactoryResolveType');

const _fileService = FactoryContainer.Resolve(FactoryResolveType.FILE_SERVICE, true);

router.get('/:id', async (req, res)=>{
    const file = await _fileService.getFile(req.params.id);
    res.send(file);
});

router.post('/createFile', async (req, res)=>{
    const id = await _fileService.createFile(req, res);
    res.send(id);
});

router.put('/updateFile', async (req, res)=>{
    await _fileService.updateFile(req.body);
    res.send();
});

router.delete('/removeFile/:id', async (req, res)=>{
    await _fileService.removeFile(req.params.id);
    res.send();
});

router.delete('/removeFile/:ModuleID/:ReferenceID/:FileUsageType', async (req, res)=>{
    await _fileService.removeFilesByModuleAndRefAndFileUsage(req.params.ModuleID, req.params.ReferenceID, req.params.FileUsageType);
    res.send();
});


module.exports = router;