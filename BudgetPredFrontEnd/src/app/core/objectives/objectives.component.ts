import { Component, OnInit } from '@angular/core';
import { ObjectivesService } from '../services/objectives.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Form } from 'src/models/Form';

@Component({
  selector: 'app-objectives',
  templateUrl: './objectives.component.html',
  styleUrls: ['./objectives.component.css']
})

export class ObjectivesComponent implements OnInit {

  public formData:any;
  private user_id:number = 0;
  public messageError:string = "";

  constructor(
    private objService : ObjectivesService,
    private authService : AuthService
  ) { }

  ngOnInit() {
    this.user_id = this.authService.getId();
    this.getForm();
  }

  getForm(){

    this.objService.getNewForm(this.user_id).subscribe(
      (data:Form) => {
        this.formData = data;
        // check if i get a 204 response
        if (this.formData.budget == null){
          this.messageError = "not the end of the month yet";
          }
      },
      (error) => {
        console.log(error);
      }
    );


  }


}
