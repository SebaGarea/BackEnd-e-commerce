import passport from "passport";
import local from "passport-local";

import { Strategy as JWTStrategy } from 'passport-jwt';
import { cookieExtractor } from '../utilsFile.js'; 
import { config } from './config.js';

import { UsuariosManagerMongo as UserManager } from "../dao/UsuariosMongoManager.js";
import { generaHash, validaHash } from "../utilsFile.js";

export const iniciarPassport = () => {
  passport.use(
    "registro",
    new local.Strategy(
      { usernameField: "email", passReqToCallback: true },
      async (req, username, password, done) => {
        try {
          let { first_name, last_name, age } = req.body;
          if (!first_name || !last_name || !age) {
            return done(null, false);
          }

          let existe = await UserManager.getBy({ email: username });
          if (existe) {
            return done(null, false);
          }

          password = generaHash(password);
          let nuevoUsuario = await UserManager.create({
            first_name,
            last_name,
            email: username,
            age,
            password
          });

          return done(null, nuevoUsuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  );



  passport.use(
    "login", new local.Strategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const usuario = await UserManager.getBy({ email: username });
          
          if (!usuario) {
            return done(null, false, { message: "Usuario no encontrado" });
          }

          if (!validaHash(password, usuario.password)) {
            return done(null, false, { message: "Contraseña incorrecta" });
          }

          return done(null, usuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  )


  passport.use(
    'current',
    new JWTStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: config.SECRET
      },
      async (payload, done) => {
        try {
          return done(null, payload);
        } catch (error) {
          return done(error, false);
        }
      }
    ) 
  );

};
