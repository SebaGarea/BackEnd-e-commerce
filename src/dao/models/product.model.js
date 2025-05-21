import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
const {Schema} = mongoose;


const productosCollection = 'productos'; //Setemao la nueva coleccion de productos

const productosSchema = new Schema({ 
    title:{type:String, required:true},
    code:{type:Number, required:true, unique:true},
    price:{type:Number, required:true},
    stock:{type:Number, required:true},
    description:{type:String, required:true},
    status:{type:Boolean, required:true},
    thumbnail:{type:String},
    category:{type:String, required:true}
     
})

productosSchema.plugin(mongoosePaginate); 

export const ProductoModel = mongoose.model(productosCollection, productosSchema);

