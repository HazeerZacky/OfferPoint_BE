
class Offer{
    constructor(){
        this.OfferID = 0;
        this.Title = '';
        this.Description = '';
        this.Tags = '';
        this.StartDate = null;
        this.EndDate = null;
        this.CategoryID = 0;
        this.PromoCode = '';
        this.ViewsCount = 0;
        this.BrandID = 0;
        this.IsActive = true;
    }
}

module.exports = Offer;