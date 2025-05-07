import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
const {Schema} = mongoose;


const productosCollection = 'productos'; //Setemao la nueva coleccion de productos

const productosSchema = new Schema({ 
    nombre:{type:String, required:true},
    cod:{type:Number, required:true, unique:true},
    precio:{type:Number, required:true},
    stock:{type:Number, required:true},
    descripcion:{type:String, required:true},
    status:{type:Boolean, required:true},
    thumbnail:{type:String}
     
})

productosSchema.plugin(mongoosePaginate); 

export const ProductoModel = mongoose.model(productosCollection, productosSchema);

