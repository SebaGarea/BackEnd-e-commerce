import { UsuariosDAOMongo as UsuariosDAO } from "../dao/UsuariosDAOMongo.js";
import { generaHash } from "../utilsFile.js";

class UsuariosService {
  constructor(dao) {
    this.usuariosDAO = dao;
  }

  async getUsuarios() {
    return await this.usuariosDAO.getAll();
  }

 async getUsuariosById(id) {
    return await this.usuariosDAO.getById(id);
  }

  async updateUsuario(id, datosActualizados){
    if(datosActualizados.password){
        datosActualizados.password = generaHash(datosActualizados.password)
    }
    return await this.usuariosDAO.update(id, datosActualizados);
  }

  //falta hacer el delete usuarios

}

export const usuariosService = new UsuariosService(UsuariosDAO);
