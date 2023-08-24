import { Component, OnInit } from '@angular/core';
import { ObjectivesService } from '../services/objectives.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MonthlyBudget } from 'src/models/MonthlyBudget';
import { RxFormBuilder, RxFormGroup } from '@rxweb/reactive-form-validators';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-objectives',
  templateUrl: './objectives.component.html',
  styleUrls: ['./objectives.component.css']
})

export class ObjectivesComponent implements OnInit {

  public formData:any;
  private user_id:number = 0;
  public messageError:string = "";
  public monthly_budget_id:number = 0;
  public displayForm:boolean = false;

  public form = <RxFormGroup> this.formService.group(
    {
      budget: ['',Validators.required],
      month : ['',Validators.required],
    }
  );

  constructor(
    private objService : ObjectivesService,
    private authService : AuthService,
    private formService : RxFormBuilder,
  ) { }

  ngOnInit() {
    this.user_id = this.authService.getId();
    this.getForm();
  }

  getForm(){
    const today = new Date();
    const month = today.getMonth();

    this.objService.getNewForm(this.user_id,month).subscribe(
      (data:any) => {
      
        // check 
        if(data == null){
          this.messageError = "You can set the budget only once per month";
          return;
          }
            this.formData = data.data;
        this.monthly_budget_id = this.formData.id;
        // set the form values
        this.form.patchValue({
          budget: this.formData.budget,
          month: this.formData.month,
        });
        if(this.formData.needs_new_form == true){
          this.displayForm = true;
        }

      },
      (error) => {
        this.messageError = error.message;
        console.log(error);
      }
    );




  }

  saveForm(){
    // get the form values
    const form_ = this.form.toFormData();
    form_.append('monthly_budget_id',this.monthly_budget_id.toString());
    // get today's actual month to append it to the form
    this.objService.saveNewForm(this.formData).subscribe(
      (data:any) => {
        console.log(data);
      },
      (error) => {
         this.messageError = error;
        console.log(error);
      }
    );

  }


}
