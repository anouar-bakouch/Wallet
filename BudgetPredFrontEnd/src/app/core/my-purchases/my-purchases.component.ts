import { Component } from '@angular/core';
import { SpaceService } from '../services/space.service';

@Component({
  selector: 'app-my-purchases',
  templateUrl: './my-purchases.component.html',
  styleUrls: ['./my-purchases.component.css']
})

export class MyPurchasesComponent {

  my_purchases: any[] = [];
  user_id:number = 0;

  constructor(
    private spaceService: SpaceService,
  ){}

  ngOnInit() {
    this.user_id = Number(localStorage.getItem('user_id'));
    this.getMyPurchases();
  }

  getMyPurchases(){    
    this.spaceService.getPurchaseByUser(this.user_id).subscribe( (data: any) => {
      this.my_purchases = data;
      console.log(data)
    } );
  }

}
