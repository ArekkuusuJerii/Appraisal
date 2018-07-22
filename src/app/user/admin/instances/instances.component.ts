import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Instance, Organization, Type } from '../../../_model/organization';
import { InstanciaService } from '../../../_service/instancia.service';
import { AreaProceso } from '../../../_model/cmmi';
import { CmmiService } from '../../../_service/cmmi.service';
import { NotificationService } from '../../../_service/notification.service';

const pattern = '^[0-9a-zA-ZáéíóúàèìòùÀÈÌÒÙÁÉÍÓÚñÑüÜ_:().´&?!#$,\\\\-]([0-9a-zA-ZáéíóúàèìòùÀÈÌÒÙÁÉÍÓÚñÑüÜ_:().´&?!#$,\\\\-]| (?! ))+$';

@Component({
  selector: 'app-instances',
  templateUrl: './instances.component.html',
  styleUrls: ['./instances.component.css']
})
export class InstancesComponent implements OnInit {
  @Input() org: Organization;
  columns: any[];
  formInstance: FormGroup;
  displayDialog: boolean;
  selectedInstance: Instance;
  areaProcesos: AreaProceso[];
  instances: Instance[] = [];
  instance: Instance = {};
  new: boolean;

  types: Type[];
  source: AreaProceso[];

  constructor(
    private instanciaService: InstanciaService,
    private cmmi: CmmiService,
    private message: NotificationService,
    private builder: FormBuilder) {
  }

  ngOnInit() {
    this.columns = [
      {field: 'nombre', header: 'Nombre'},
      {field: 'instanciaTipo', subfield: 'descripcion', header: 'Categoría'}
    ];
    this.instanciaService.getAll(this.org).subscribe(all => this.instances = all);
    this.instanciaService.getTypes().subscribe(types => this.types = types);
    this.cmmi.getAllAreaProcesos(this.org).subscribe(areas => this.areaProcesos = areas);
    this.formInstance = this.builder.group({
      'titulo': ['', Validators.compose([Validators.required, Validators.pattern(pattern)])],
      'instanciaTipo': ['', Validators.required]
    });
  }

  get controlI() {
    return this.formInstance.controls;
  }

  add() {
    this.new = true;
    this.instance = {
      areaProcesos: []
    };
    this.displayDialog = true;
    this.source = this.areaProcesos.slice();
    for (const subArea of this.instance.areaProcesos) {
      this.source = this.source.filter(area => area.id !== subArea.id);
    }
    this.formInstance.reset();
  }

  select(event) {
    const instance = event.data;
    this.new = false;
    this.instance = {
      id: instance.id,
      nombre: instance.nombre,
      instanciaTipo: instance.instanciaTipo,
      areaProcesos: instance.areaProcesos.slice()
    };
    this.displayDialog = true;
    this.source = this.areaProcesos.slice();
    for (const subArea of this.instance.areaProcesos) {
      this.source = this.source.filter(area => area.id !== subArea.id);
    }
  }

  delete() {
    this.instanciaService.delete(this.instance).subscribe();
    this.instances = this.instances.filter(instance => instance !== this.selectedInstance);
    this.instance = null;
    this.displayDialog = false;
    this.message.notify('success', 'Se ha eliminado una instancia');
  }

  save() {
    if (this.instance) {
      if (this.formInstance.valid) {
        const instances = [...this.instances];
        if (this.new) {
          this.instanciaService.save(this.instance, this.org).subscribe(instance => {
            instances.push(instance);
            this.instances = instances;
            this.instance = null;
            this.displayDialog = false;
            this.message.notify('success', 'Se ha creado una instancia');
          });
        } else {
          this.instanciaService.update(this.instance).subscribe(instance => {
            instances[instances.indexOf(this.selectedInstance)] = instance;
            this.instances = instances;
            this.instance = null;
            this.displayDialog = false;
            this.message.notify('success', 'Se ha actualizado una instancia');
          });
        }
      } else {
        this.message.notify('warn', 'Hay errores presentes', 'Existen errores en su formulario');
      }
    }
  }

  close() {
    this.instance = null;
    this.selectedInstance = null;
    this.displayDialog = false;
  }
}
