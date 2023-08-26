import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { RxFormBuilder, RxFormGroup } from '@rxweb/reactive-form-validators';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';
import { User } from 'src/models/User';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  private user_id: number = 0;
  profile_pic: string = "";
  public selectedFie: null | null = null; // Adjusted the type to File
  messageupdate = "";
  showMessage = false;

  constructor(
    private fservice: RxFormBuilder,
    private authService: AuthService
  ) { }

  public userForm = this.fservice.group({
    username: ['', Validators.required],
    last_name: ['', Validators.required],
    first_name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    path_photo: ['', Validators.required],
    language: ['', Validators.required],
    currency: ['', Validators.required]
  }) as RxFormGroup; // Added type assertion

  ngOnInit(): void {
    this.user_id = this.authService.getId();

    this.authService.getUserInfo(this.user_id).subscribe(
      (data: any) => {
        this.userForm.patchValue(data.user);
        this.profile_pic = environment.apiUrl + "/" + data.user.path_photo;
      }
    );
  }

  submit() {

    if(this.userForm.valid){
      console.log(this.userForm.value)
      const formData = new FormData();
      formData.append('username', this.userForm.value.username);
      formData.append('last_name', this.userForm.value.last_name);
      formData.append('first_name', this.userForm.value.first_name);
      formData.append('email', this.userForm.value.email);
      formData.append('password', this.userForm.value.password);
      formData.append('language', this.userForm.value.language);
      formData.append('currency', this.userForm.value.currency);
      formData.append('id', this.user_id.toString())
      const selectedFile = (document.getElementById('inputGroupFile01') as HTMLInputElement).files;
      if (selectedFile != null) {
        formData.append('path_photo', selectedFile[0], selectedFile[0].name);
      }
      this.authService.updateUser(this.user_id,formData ).subscribe(
        (data: any) => {
         
        }
      );
    } else {
      console.log("error");
    }
 
  }

  onFileSelected(event: any) {
    this.selectedFie = event.target.files[0];
  }

}