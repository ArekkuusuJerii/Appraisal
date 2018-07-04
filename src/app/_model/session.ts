export class Usuario {
  token?: string;
  key?: string;
  person?: Persona;
  usuarioRol?: UsuarioRol;
}
export class Persona {
  name: string;
  primerApellido: string;
  segundoApellido: string;
}
export class UsuarioRol {
  descripcion: string;
}
