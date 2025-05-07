export class ProductoDTO{
    constructor(producto){
        this.nombre=producto.nombre
        this.cod=producto.cod;
        this.precio=producto.precio;
        this.stock=producto.stock;
        this.descripcion=producto.descripcion;
        this.status=producto.status;
        this.thumbnail=producto.thumbnail;
    }


static fromObject(productoObj){
    return new ProductoDTO(productoObj)
}

static fromArray(productos){
    return productos.map(producto => ProductoDTO.fromObject(producto))
}


}