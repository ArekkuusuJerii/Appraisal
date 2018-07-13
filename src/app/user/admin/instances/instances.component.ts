import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Instance, Organizacion, Type } from '../../../_model/org';
import { InstanciaService } from '../../../_service/instancia.service';
import { AreaProceso } from '../../../_model/cmmi';
import { CmmiService } from '../../../_service/cmmi.service';

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
  instances: Instance[] = [];
  instance: Instance = {};
  new: boolean;

  types: Type[];
  source: AreaProceso[];
  target: AreaProceso[];

  constructor(
    private instanciaService: InstanciaService,
    private cmmi: CmmiService,
    private builder: FormBuilder) {
  }

  ngOnInit() {
    this.columns = [
      {field: 'nombre', header: 'Nombre'},
      {field: 'instanciaTipo', header: 'Tipo'}
    ];
    this.instanciaService.getAll(this.org).subscribe(all => this.instances = all);
    this.instanciaService.getTypes().subscribe(types => this.types = types);
    this.cmmi.getAreaProcesos(this.org).subscribe(areas => this.source = areas);
    this.formInstance = this.builder.group({
      'titulo': ['', Validators.required],
      'instanciaTipo': ['', Validators.required],
      'areaProcesos': ['', Validators.required]
    });
  }

  get controlI() {
    return this.formInstance.controls;
  }

  add() {
    this.new = true;
    this.instance = {};
    this.displayDialog = true;
    this.cmmi.getAreaProcesos(this.org).subscribe(areas => this.source = areas);
    this.target = [];
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
  }

  delete() {
   // this.instanciaService.delete(this.instance).subscribe();
    this.instances = this.instances.filter(instance => instance !== this.instance);
    this.displayDialog = false;
    this.instance = null;
  }

  save() {
    if (this.instance) {
      if (!this.formInstance.invalid) {
        if (this.new) {
         // this.instanciaService.save(this.instance, this.org).subscribe(instance => {
        //    this.instances.push(instance);
        //  });
        } else {
        //  this.instanciaService.update(this.instance, this.org).subscribe(instance => {
        //    this.instances.push(instance);
       //   });
        }
      }
    }
  }

  close() {
    this.instance = null;
    this.selectedInstance = null;
    this.displayDialog = false;
  }
}
