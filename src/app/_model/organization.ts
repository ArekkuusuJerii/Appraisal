import { AreaProceso, Nivel } from './cmmi';

export class User {
  id?: number;
  username?: string;
  password?: string;
  persona?: Person;
  organizacion?: Organization;
}
export class Person {
  id?: number;
  nombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
}
export class Organization {
  id?: number;
  nivel?: Nivel;
  nombre?: string;
}

export class Instance {
  id?: number;
  nombre?: string;
  instanciaTipo?: Type;
  areaProcesos?: AreaProceso[];
}
export class Type {
  id: number;
  descripcion: string;
}
