const mongoose = require('mongoose');
const dbConnect = async () => {
   try {
      await mongoose.connect("mongodb://localhost:27017/ems_system",
         {
            useNewUrlParser: true,
            useUnifiedTopology: true,
         })
      console.log("DB Connected SuccessFullY")
   } catch (error) {
      console.log(`Throw An Error :${error}`)
   }
};
module.exports = dbConnect;