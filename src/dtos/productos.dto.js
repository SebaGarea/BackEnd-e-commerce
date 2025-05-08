export class ProductoDTO{
    constructor(producto){
        this.nombre = producto.nombre;
        this.cod = parseInt(producto.cod);
        this.precio = parseFloat(producto.precio);
        this.stock = parseInt(producto.stock);
        this.descripcion = producto.descripcion;
        this.status = producto.status === 'true';
        this.thumbnail = producto.thumbnail;
    }

    validate() {
        if (!this.nombre || !this.precio || !this.stock) {
            throw new Error('Faltan campos requeridos');
        }
        if (this.precio <= 0) {
            throw new Error('El precio debe ser mayor a 0');
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