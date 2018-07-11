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
