import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Instance, Organizacion } from '../../../_model/org';

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

  constructor(private builder: FormBuilder) {
  }

  ngOnInit() {
    this.columns = [
      {field: 'nombre', header: 'Nombre'},
      {field: 'instanciaTipo', header: 'Tipo'}
    ];
    this.formInstance = this.builder.group({
      'nombre': ['', Validators.required],
      'instanciaTipo': ['', Validators.required]
    });
  }

  get controlI() {
    return this.formInstance.controls;
  }

  add() {
    this.new = true;
    this.instance = {};
    this.displayDialog = true;
  }

  select(event) {
  }

  delete() {
  }

  save() {
  }

  close() {
    this.instance = null;
    this.selectedInstance = null;
    this.displayDialog = false;
  }
}
