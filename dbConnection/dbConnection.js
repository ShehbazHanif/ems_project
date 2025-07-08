const mongoose = require('mongoose');
const dbConnect = async () => {
   try {
      await mongoose.connect("mongodb+srv://tahir:112233test@auctionplatform.veyca.mongodb.net/EMS_DB")
      console.log("DB Connected SuccessFullY")
   } catch (error) {
      console.log(`Throw An Error :${error}`)
   }
};
module.exports = dbConnect;