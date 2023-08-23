import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { RxFormBuilder, RxFormGroup } from '@rxweb/reactive-form-validators';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent {

  private user_id:number = 0;
  profile_pic : string = "";
  public selectedFile : any | null = null;

  constructor(
        private fservice: RxFormBuilder,
        private authService : AuthService
  ){}

  public userForm = <RxFormGroup> this.fservice.group({
    username : ['',Validators.required],
    last_name : ['',Validators.required],
    first_name : ['',Validators.required],
    email : ['',Validators.required],
    password : ['',Validators.required],
    path_photo : ['',Validators.required],
    month_budget : ['',Validators.required]
  }) 

  ngOnInit(): void {

    this.user_id = this.authService.getId();
    
    this.authService.getUserInfo(this.user_id).subscribe(
      (data:any) => {
        this.userForm.patchValue(data.user);

        // profile pic
        this.profile_pic = environment.apiUrl+"/"+data.user.path_photo;
      }
    )
    
  }

  submit(){
    const selectedF = (document.getElementById('inputGroupFile01') as HTMLInputElement).files;
    const formData = this.userForm.toFormData();
    if(selectedF != null){
    formData.append('path_photo', selectedF[0], selectedF[0].name);
    }
    this.authService.updateUser(this.user_id,formData).subscribe(
      (data:any) => {
        console.log(data);
      }
    )
  }

  onFileSelected(event:any){
   this.selectedFile = event.target.files[0];
  }
  

}
