import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../_service/session.service';
import { Instance, Organization } from '../../_model/organization';
import { InstanciaService } from '../../_service/instancia.service';
import { TreeNode } from 'primeng/api';
import { CmmiService } from '../../_service/cmmi.service';

@Component({
  selector: 'app-org',
  templateUrl: './org.component.html',
  styleUrls: ['./org.component.css']
})
export class OrgComponent implements OnInit {
  files: TreeNode[];
  cols: any[];
  loading;
  instances: Instance[] = [];
  instance: Instance;
  org: Organization;
  selection;
  drag;

  constructor(
    private instanciaService: InstanciaService,
    private cmmiService: CmmiService,
    private session: SessionService) {
  }

  ngOnInit() {
    this.session.tryRedirect();
    this.cols = [
      {field: 'nombre', header: 'Nombre', width: '20%'},
      {field: 'descripcion', header: 'Descripción', width: '80%'}
    ];
    if (SessionService.getSession().organizacion) {
      this.org = SessionService.getSession().organizacion;
      this.instanciaService.getAll(this.org).subscribe(all => this.instances = all);
    }
  }

  load(instance: Instance) {
    this.files = [];
    this.instance = instance;
    for (const area of instance.areaProcesos) {
      this.files.push({
        data: {
          id: area.id,
          nombre: area.nombre,
          descripcion: area.descripcion
        },
        leaf: false,
        label: 'area'
      });
    }
  }

  expand(event) {
    this.loading = true;
    const node = event.node;
    switch (node.label) {
      case 'area': {
        node.children = [];
        this.cmmiService.getMetas(node.data.id).subscribe(metas => {
          for (const meta of metas) {
            node.children.push({
              data: {
                id: meta.id,
                nombre: meta.nombre,
                descripcion: meta.descripcion
              },
              leaf: false,
              label: 'meta'
            });
          }
          this.loading = false;
          this.files = [...this.files];
        });
        break;
      }
      case 'meta': {
        node.children = [];
        this.cmmiService.getPracticas(node.data.id).subscribe(practicas => {
          for (const practica of practicas) {
            node.children.push({
              data: practica,
              leaf: true,
              label: 'practica'
            });
          }
          this.loading = false;
          this.files = [...this.files];
        });
        break;
      }
      default: {
        this.loading = false;
        break;
      }
    }
  }

  select(rowNode) {
    if (rowNode.node.leaf) {
      this.selection = {
        instance: this.instance,
        practice: rowNode.node.data
      };
    }
  }

  cancel() {
    this.instance = null;
  }
}
