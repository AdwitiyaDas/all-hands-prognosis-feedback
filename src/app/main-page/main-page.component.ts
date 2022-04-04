import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {NgbConfig, NgbCarousel, NgbSlideEvent, NgbSlideEventSource,NgbModule} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css', './css/bootstrap.css']
})
export class MainPageComponent implements OnInit {
  @ViewChild("bgmodal", { static: false }) bgmodal!: ElementRef;

  showHome:Boolean = true
  constructor(ngbConfig: NgbConfig) { }

  ngOnInit(): void {
  }

  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
 
  loginPopUpMethod(){
    this.showHome=false
    this.bgmodal.nativeElement.style.display = "flex"
  }
 
  cancelPopUp(){
    this.showHome=true
    this.bgmodal.nativeElement.style.display = "none"
  }
}
