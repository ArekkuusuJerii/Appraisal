import { Organization } from './organization';

export class Session {
  username: string;
  usuarioRol?: Rol;
  persona?: Info;
  organizacion?: Organization;
  token?: string;
  key?: string;
}
export class Rol {
  descripcion: string;
}
export class Info {
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
}
