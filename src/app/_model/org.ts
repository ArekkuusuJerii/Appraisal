import { Nivel } from './cmmi';

export class Usuario {
  id?: number;
  username?: string;
  password?: string;
  persona?: Persona;
  organizacion?: Organizacion;
}
export class Persona {
  id?: number;
  nombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
}
export class Organizacion {
  id?: number;
  nivel?: Nivel;
  nombre?: string;
}

export class Instance {
  id?: number;
  nombre?: string;
  instanciaTipo?: Type;
}
export class Type {
  id: number;
  descripcion: string;
}
