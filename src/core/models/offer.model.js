
export class OfferModel{
    constructor(){
        this.OfferID = 0;
        this.Title = '';
        this.Description = '';
        this.Tags = '';
        this.StartDate = new Date();
        this.EndDate = new Date();
        this.CategoryID = 0;
        this.PromoCode = '';
        this.ViewsCount = 0;
        this.BrandID = 0;
        this.IsActive = true;
    }
}
