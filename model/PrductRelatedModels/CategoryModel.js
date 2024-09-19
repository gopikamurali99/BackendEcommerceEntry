import mongoose from "mongoose";
const {Schema} = mongoose;


const categorySchema = new Schema({
       
      Category: String,
      categorySubclass: String,
      images:{type: String }
       
    })

const Category = mongoose.model ('ProductCategoryRoutesModel', productCategoryRoutesSchema)

export default Category
