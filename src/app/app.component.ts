import { BrowserModule, Title, Meta } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { StarRatingComponent } from 'ng-starrating';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  
  onRate($event:{oldValue:number, newValue:number, starRating:StarRatingComponent}) {
    alert(`Old Value:${$event.oldValue}, 
      New Value: ${$event.newValue}, 
      Checked Color: ${$event.starRating.checkedcolor}, 
      Unchecked Color: ${$event.starRating.uncheckedcolor}`);
  }
  subscription: Subscription;
  constructor(
    public router: Router,
    private titleService: Title,
    private meta: Meta
  ){}
  ngOnInit(){
    this.titleService.setTitle('Safety Wagon - Best Seller For All Safety and Security Products.'); 
    /*this.meta.addTag({name: 'title', content : 'Safety Wagon - Best Seller For All Safety and Security Products.'});*/
    this.meta.addTag({name: 'keywords', content : 'Best Safety Shoes Online , Road Safety Equipment ,  Disposable Safety Products , Cctv Surveillance System , Fire Extinguisher'});
    this.meta.addTag({name: 'description', content : "Safety Wagon is central india's first e-commerce platform for cctv camera, safety shoes, road safety fire safety and security products cod shipping available"});
    /*this.meta.addTag({name: 'author', content : 'author'});
    this.meta.addTag({name: 'robots', content : 'robots'});*/
    /*this.meta.updateTag({name : 'title', content: 'Safety Wagon - Best Seller For All Safety and Security Products.'});*/
    this.meta.updateTag({name : 'keywords', content: 'Best Safety Shoes Online , Road Safety Equipment ,  Disposable Safety Products , Cctv Surveillance System , Fire Extinguisher'});
    this.meta.updateTag({name : 'description', content: "Safety Wagon is central india's first e-commerce platform for cctv camera, safety shoes, road safety fire safety and security products cod shipping available"});
    this.subscription = this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd)
    )
    .subscribe();
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
