import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Instance, Organizacion, Type } from '../../../_model/org';
import { InstanciaService } from '../../../_service/instancia.service';
import { AreaProceso } from '../../../_model/cmmi';
import { CmmiService } from '../../../_service/cmmi.service';
import { NotificationService } from '../../../_service/notification.service';

@Component({
  selector: 'app-instances',
  templateUrl: './instances.component.html',
  styleUrls: ['./instances.component.css']
})
export class InstancesComponent implements OnInit {
  @Input() org: Organizacion;
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
      {field: 'instanciaTipo.descripcion', header: 'Tipo'}
    ];
    this.instanciaService.getAll(this.org).subscribe(all => this.instances = all);
    this.instanciaService.getTypes().subscribe(types => this.types = types);
    this.cmmi.getAreaProcesos(this.org).subscribe(areas => this.areaProcesos = areas);
    this.formInstance = this.builder.group({
      'titulo': ['', Validators.required],
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
    for (const inst of this.instances) {
      for (const subArea of inst.areaProcesos) {
        this.source = this.source.filter(area => area.id !== subArea.id);
      }
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
      areaProcesos: instance.areaProcesos
    };
    this.displayDialog = true;
    this.formInstance.reset();
    this.source = this.areaProcesos.slice();
    for (const inst of this.instances) {
      for (const subArea of inst.areaProcesos) {
        this.source = this.source.filter(area => area !== subArea);
      }
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
      if (!this.formInstance.invalid && this.instance.areaProcesos.length > 0) {
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
          this.instanciaService.update(this.instance, this.org).subscribe(instance => {
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
