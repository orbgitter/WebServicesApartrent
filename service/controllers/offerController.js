const Offer  = require('../models/offer');
const mongoose = require('mongoose');
const mongodb = require('../database');
let dateNow = new Date();

function validateDates(tenantStartDate, tenantEndDate, landLordStartDate, landLordEndDate, currentDate) {    
    //if(/^(\d{4})-(\d{1,2})-(\d{1,2})$/.test(tenantStartDate))   is validation needed ? since date is a type
    //  name == ' ' || name.length == 0 || FormData.name.value =="" ||  )) 
    if(!(Math.abs(tenantStartDate-landLordStartDate) < 0 || 
        Math.abs(tenantEndDate - landLordEndDate) > 0 || Math.abs(landLordEndDate - currentDate) < 0))    
        {
      return (true)
    }
      console.log("You have entered an invalid dates!")
      return (false)
  }

function validateUser(user) {
    if(!(user == null ))
    {
        return (true)
    }
    console.log("User is missing!")
    return (false)
}
  
exports.offerController = {
  getAllOffers(req, res, next) {
    let result = [];
    result.sort(function(a, b){return b - a});
    //document.getElementById("demo").innerHTML = results;
    console.log("Received a request...");
    Offers.find({})
    .then(docs =>{
      console.log(docs);
      return res.json(docs);
      })
      .catch(err => console.log(`query error: ${err}`));
  },
  getOfferById(req, res, next) {
    mongoose.connect(mongodb.mongoDbUrl, mongodb.mongoDbOptions)
    .then(async() => {
      const {id = null} = req.params;
      const result = await Offer.findOne({_id: id});

      if(result) res.json(result)
      else res.status(404).send(`offer with the id ${id} has not been found`);
    })
    .catch(err => {
      console.error('some error occurred', err);
      res.status(500).send(err.message);
    })
  },
  
  addOffer(req, res, next) {
    console.log('new entity saved!');
    // const { body } = req;
    // restaurant.push(body);
    // res.send('new entity saved!');

    mongoose.connect(mongodb.mongoDbUrl, mongodb.mongoDbOptions)
      .then(async() => {
        const {
          id = null, // needed ???
          tenant = null,
          tenantStartDate = null,
          tenantEndDate = null,
          apartment=null,
          currentDate = dateNow.now()
        } = req.body;
        console.log("req.body");
        console.log(req.body);
        console.log(`tenant = ${tenant}, tenantStartDate = ${tenantStartDate}, tenantEndDate = ${tenantEndDate}, currentDate = ${currentDate} , apartment=${apartment}`);
    //    if(validateDates(tenantStartDate, tenantEndDate, landLordStartDate, landLordEndDate, currentDate)   import aprt's dates
     //   && validateUser(tenant) && validateUser(landLord))
        {
          const offer = new Offer({id, tenant, landLord, tenantStartDate, tenantEndDate, currentDate});
          console.log(offer);
          const result = await offer.save();
          console.log(result);
        }
        if(result) {
          res.json(result);
        }
        else {
          res.status(404).send('not found');
        }
      }).catch(err => {
        console.error("Some error occured", err);
        res.status(500).send(err);
      })
  },
  
  editOffer(req,res,next){
    mongoose.connect(mongodb.mongoDbUrl, mongodb.mongoDbOptions)
    .then(async() => {
      const {id = null} = req.params;  
      const {tenant = null, tenantStartDate = null, tenantEndDate = null, currentDate = dateNow.now()} = req.body; // null or existed value ?
     // if(validateDates(tenantStartDate, tenantEndDate, landLord.apartment.startDate, landLord.apartment.landLordEndDate, currentDate)   import aprt's dates
    //   && validateUser(tenant) && validateUser(landLord)) 
      {
        const result = await Offer.updateOne({_id: id}, {tenant, landLord, tenantStartDate, tenantEndDate, startDate, endDate, currentDate})  
      }     
        
      if(result) res.json(result)
      else res.status(404).send(`offer with the id ${id} has not been found`);
    })
    .catch(err => {
      console.error("Some error occured", err);
      res.status(500).send(err);
    })
  },
  removeOffer(req,res,next){
    mongoose.connect(mongodb.mongoDbUrl, mongodb.mongoDbOptions)
    .then(async() => {

      // const id = new mongoose.Types.ObjectID(req.body.id);
      const id = new mongoose.mongo.ObjectId(req.body.id);
      const result = await Offer.deleteOne({_id : id});

      if(result) res.json(result)
      else res.status(404).send(`review with the id ${id} has not been found`);
    })
    .catch(err => {
      console.error("Some error occured", err);
      res.status(500).send(err);
    })
  }
};