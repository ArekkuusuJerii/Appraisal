import { Organizacion } from './org';

export class Session {
  username: string;
  usuarioRol?: Rol;
  persona?: Info;
  organizacion?: Organizacion;
  token?: string;
  key?: string;
}
export class Rol {
  descripcion: string;
}
export class Info {
  name: string;
  primerApellido: string;
  segundoApellido: string;
}
