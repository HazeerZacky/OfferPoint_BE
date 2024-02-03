const CategoryRepository = require('../Repository/CategoryRepository');
const BrandRepository = require('../Repository/BrandRepository');
const FileRepository = require('../Repository/FileRepository');
const OfferRepository = require('../Repository/OfferRepository');
const UserRepository = require('../Repository/UserRepository');
const OfferPointDbContext = require('../DbContext/OfferPointDbContext');
const AdvertisementRepository = require('../Repository/AdvertisementRepository');

class UnitOfWork{
    constructor(){
        this.context = new OfferPointDbContext().getContext();
        this.Category = new CategoryRepository(this.context);
        this.Brand = new BrandRepository(this.context);
        this.File = new FileRepository(this.context);
        this.Offer = new OfferRepository(this.context);
        this.User = new UserRepository(this.context);
        this.Ads = new AdvertisementRepository(this.context);
    }
}

module.exports = UnitOfWork;