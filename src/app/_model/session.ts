export class Usuario {
  id?: number;
  username: string;
  persona?: Persona;
  usuarioRol?: UsuarioRol;
  token?: string;
  key?: string;
}
export class Persona {
  id: number;
  name: string;
  primerApellido: string;
  segundoApellido: string;
}
export class UsuarioRol {
  id: number;
  descripcion: string;
}
