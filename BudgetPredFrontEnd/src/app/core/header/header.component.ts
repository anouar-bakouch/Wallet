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
  notSetup:boolean = true;
  currencies = this.hservice.currencies;
  languages = this.hservice.Languages;
  actual_budget = 0;
  actual_month = 0;

  userForm = <RxFormGroup> this.fservice.group({
    currency : ['',Validators.required],
    language : ['',Validators.required],
  });

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
    this.notSetup = true;
    // open the modal if language and currency are not saved in the local storage
    if (localStorage.getItem('language') !== null && localStorage.getItem('currency') !== null) {
      this.notSetup = false;
    }
    this.actualMonthBudget();
  }

  SaveSelection(){
    
    const user_id = this.authService.getId();
    this.authService.updateUser(user_id,this.userForm.value).subscribe((data:any) => {
      localStorage.setItem('language',this.userForm.value.language);
      localStorage.setItem('currency',this.userForm.value.currency);
    },
    (error:any) => {
      console.log(error);
    },
    ()=>{
      this.notSetup = false;
      // close the modal
      this.modalService.dismissAll();
    });
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
      this.actual_month = data.month.split('-')[1];
    }
    ,(error:any) => {
      console.log(error);
    });
  }
 
}
