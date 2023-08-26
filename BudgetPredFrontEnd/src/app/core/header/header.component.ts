import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RxFormBuilder, RxFormGroup } from '@rxweb/reactive-form-validators';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';
import { User } from 'src/models/User';
import { HeaderService } from '../services/header.service';

@Component({
  selector: '[app-budget-header]',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})


export class HeaderBudgetComponent {

  public user :User | undefined;
  public photoPath = '';
  show_loading : boolean = false;
  closeResult:string = ''
  actual_budget = 0;
  actual_month:string="";
  spendings = 0;
  savings = 0;
  months = [
    {id:1,name:'January'},
    {id:2,name:'February'},
    {id:3,name:'March'},
    {id:4,name:'April'},
    {id:5,name:'May'},
    {id:6,name:'June'},
    {id:7,name:'July'},
    {id:8,name:'August'},
    {id:9,name:'September'},
    {id:10,name:'October'},
    {id:11,name:'November'},
    {id:12,name:'December'},
  ]
  most_bought_categories = []

  constructor(
    public authService:AuthService,
    public fservice : RxFormBuilder,
    private modalService: NgbModal,
    private hservice:HeaderService
  ) {

    const id = Number(localStorage.getItem('user_id'));
    this.show_loading = true;
    this.authService.getUserInfo(id).forEach((data:any) => {
      this.user = data.user;
      // fix the image path 
      this.photoPath = `${environment.apiUrl}/${this.user?.path_photo}`;
      this.show_loading = false;
    } 
    );

   }

  onLogout(){
    this.authService.logout();
  }

  ngOnInit(): void {
    this.actualMonthBudget();
    this.hservice.mostBoughtCategories(this.authService.getId()).subscribe((data:any) => {
      this.most_bought_categories = data;
    }
    ,(error:any) => {
      console.log(error);
    }
    );
  }



  open(content: any) {
    if (content._declarationTContainer.localNames[0] == 'mymodal_') {
      // this.userForm.reset();
    }
    
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result: any) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason: any) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
 
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  
  actualMonthBudget(){
    this.hservice.actualMonthBudget(this.authService.getId()).subscribe((data:any) => {
      this.actual_budget = data.budget;
      this.actual_month =  this.months.filter((month:any) => month.id == data.month.split('-')[1])[0].name;
      this.spendings = data.spendings;
      this.savings = data.savings;
    }
    ,(error:any) => {
      console.log(error);
    });
  }
 
}
