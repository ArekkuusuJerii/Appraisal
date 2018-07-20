export class Evidence {
  id?: number;
  artefactos?: Artifact[];
  hipervinculos?: Hiperlink[];
}
export class Artifact {
  id?: number;
  nombre?: string;
  tipo?: string;
  fecha?: Date;
}
export class Hiperlink {
  id?: number;
  link: string;
  fecha?: Date;
}
