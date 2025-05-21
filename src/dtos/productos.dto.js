export class ProductoDTO{
    constructor(producto){
        this.title = producto.title;
        this.code = parseInt(producto.code);
        this.price = parseFloat(producto.price);
        this.stock = parseInt(producto.stock);
        this.description = producto.description;
        this.status = producto.status === 'true';
        this.thumbnail = producto.thumbnail;
        this.category = producto.category;
    }

    validate() {
        if (!this.title || !this.price || !this.stock) {
            throw new Error('Faltan campos requeridos');
        }
        if (this.price <= 0) {
            throw new Error('El price debe ser mayor a 0');
        }
        if (this.stock < 0) {
            throw new Error('El stock no puede ser negativo');
        }
    }

static fromObject(productoObj){
    return new ProductoDTO(productoObj)
}

static fromArray(productos){
    return productos.map(producto => ProductoDTO.fromObject(producto))
}


}