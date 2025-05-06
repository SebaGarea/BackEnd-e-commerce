import { usuariosModelo } from "./models/user.model.js";

export class UsuariosDAOMongo {
  static create(usuario) {
    let nuevoUsuario = usuariosModelo.create(usuario);
    return nuevoUsuario.toJSON();
  }

  static getBy(filtro) {
    // {nombre:"Juan"}
    return usuariosModelo.findOne(filtro).lean(); // .lean transforma la rts de mongoose en un objeto plain de JS
  }

  static getById(id) {
    return usuariosModelo.findById(id).lean();
  }

  static getAll() {
    return usuariosModelo.find().lean();
  }

  static update(id, datosActualizados) {
    return usuariosModelo
      .findByIdAndUpdate(id, { $set: datosActualizados }, { new: true })
      .lean();
  }
}
