import { BrowserModule, Title, Meta } from '@angular/platform-browser';
import { Component, OnInit, Inject } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, Subscription } from "rxjs";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { AlertService, UsersService } from '../../../_service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MAT_PAGINATOR_INTL_PROVIDER, throwToolbarMixedModesError } from "@angular/material";
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Options, LabelType, Ng5SliderModule } from 'ng5-slider';
import { NgxSpinnerService } from "ngx-spinner";
import { Location } from '@angular/common';

export interface DialogData {
  otpdata: any;
}
@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.scss']
})
export class ProductListingComponent implements OnInit {
  data: any;
  deviceId = ''; AccessToken = '';
  results = []; link: any; userdata = ''; uids = 0;
  sizeOfProduct = [];
  colorOfProduct = [];
  private activatedRouteSubscription: Subscription;
  fieldList: any;
  cid: any;
  bid: any;
  catId = '';
  sidecategory = '';
  price_lowhigh = '';
  price_min = '';
  price_max = '';
  filter: any;
  SPL = 0; SPH = 0; SDL = 0; SDH = 0;
  brands = '';
  brandId = '';
  dprecent = '';
  uncatId = '';
  unbrandId = '';
  categoryname = '';
  paginations = 0; page = 1;
  cartcount: any;
  keyword = ""; searchkeyword = '';
  menuopen = false;
  session: any;
  catresults: any;
  request: any;
  otpemail = '';
  sitetype = false; sitetypeval = 'false';
  //created code start here
  resultscart = ''; totalprice: ''; totaltax = ""; subtotal = ""; shippingPrice = "";
  qtyerr = ""; errId = ""; coupons = ""; coupommessage = "";
  coupondiscount = ""; couponid = ""; couponcode= ""; getproductid; product_id; show: any;
  //created code end here
  pincode; newpincode; size; color; color_err; size_err; sizecolor_err; pincode_err; colorcode; current_product_sizes; current_product_colors;snapcid;newrout;categorycontent="";getcategorycontent="";meta_title="";meta_keyword="";meta_description="";
  //show = false;
  autohide = false;
  newArray: any;category_content="";

  onsizechange(postedsized) {
    let postedsize = postedsized;
    this.size = postedsize;
  };

  oncolorchange(postedcolorname, postedcolorcode) {
    let color = postedcolorname;
    let colorcode = postedcolorcode;
    this.color = color;
    this.colorcode = colorcode;
  };
  
  private cookieValue: string;
  constructor(
    public dialog: MatDialog,
    private userService: UsersService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location : Location,
    private _bottomSheet: MatBottomSheet,
    private spinner: NgxSpinnerService,
    private titleService: Title,
    private meta: Meta,
  ) {
      
   }

  opencategory() {
    this.menuopen = true;
  }
  closemenu() {
    this.menuopen = false;
  }

  rangeSliderMinValue: number = 1;
  rangeSliderMaxValue: number = 50000;
  rangeSliderOptions: Options = {
    floor: 1,
    ceil: 50000
  }
  
  resetforms(){
    location.reload();
  }

  ngOnInit() {
    this.sitetypeval = localStorage.getItem('sitetype');
    if (this.sitetypeval == 'true') {
      this.sitetype = true;
    }
    else if (this.sitetypeval == 'false') this.sitetype = false;
    this.cartcount = localStorage.getItem('cartcount');
    if (this.cartcount == null) this.cartcount = 0;
    this.userdata = localStorage.getItem('userdata');
    if (this.userdata)
      this.session = JSON.parse(this.userdata);
    else
      this.session = '';
    this.deviceId = this.userService.generatecookie();
    this.data = { device_id: this.deviceId, device_type: '2', api_key: 'Safety%@t$' };
    this.AccessToken = this.userService.GetAccessToken();
    if (this.AccessToken == "") {
      this.userService.accesstoken(this.data)
        .subscribe(
          data => {
            var info = JSON.parse(JSON.stringify(data));
            this.AccessToken = this.userService.GenerateAccessToken(info.access_token);
          },
          error => {
            this.alertService.error(error);
          });
    }
    this.request = { device_id: this.deviceId, device_type: '2', api_key: 'Safety%@t$', 'access_token': this.AccessToken }
    this.userService.Apicommand('/categoryList', this.request)
      .subscribe(
        catresult => {
          this.catresults = catresult['data'];
        },
        error => {
          var info = JSON.parse(JSON.stringify(error));
        });
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.cid = params.cid;
        this.keyword = params.keyword;
        this.searchkeyword = params.keyword;
      });
    this.userdata = localStorage.getItem('userdata');
    if (this.userdata != null) {
      let sessdata = JSON.parse(this.userdata);
      if (sessdata !== '' || sessdata !== 'null') this.uids = sessdata.user_id;
    }
    this.deviceId = this.userService.generatecookie();
    setTimeout(() => {
      this.AccessToken = this.userService.GetAccessToken();
      this.cartlist();
      this.filterpage();
    }, 1500);
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
  }
  cartlist() {
    this.data = {
      device_id: this.deviceId,
      device_type: '2',
      api_key: 'Safety%@t$',
      access_token: this.AccessToken,
      uid: this.uids
    };
    this.userService.Cartcommand('/listCart', this.data)
      .subscribe(
        catresult => {
          var info = JSON.parse(JSON.stringify(catresult));
          this.resultscart = info.data;
          this.link = info.product_img_link;
          this.totalprice = info.total_price;
          this.totaltax = info.totaltax;
          this.subtotal = info.subtotal;
          this.shippingPrice = info.shipping;
          const cartcounts = info.cartcount;
          localStorage.removeItem('cartcount');
          localStorage.setItem('cartcount', cartcounts);
          this.cartcount = localStorage.getItem('cartcount');
          if (info.cartRow != null && info.cartRow.discount != 0.00){
            this.coupondiscount = info.cartRow.discount;
          }
          else{
            this.coupondiscount = "";
          }
          if (info.cartRow != null && info.cartRow.promo_code_id > 0){
            this.couponid = info.cartRow.promo_code_id;
          }
          else{
            this.couponid = "";
          }
          /*if(info.couponcode.coupon_code != "" && info.couponcode.coupon_code !='undefined'){
            this.couponcode = info.couponcode.coupon_code;
          }
          else{
            this.couponcode = "";
          }*/
        },
        error => {
          var info = JSON.parse(JSON.stringify(error));
        });
  }
  // filterpage List
  filterpage() {
    this.data = {
      device_id: this.deviceId,
      device_type: '2',
      api_key: 'Safety%@t$',
      access_token: this.AccessToken,
      uid: this.uids,
      filterpage: 'yes'
    };
    this.userService.Apicommand('/categoryList', this.data)
      .subscribe(
        catresult => {
          var info = JSON.parse(JSON.stringify(this.data));
          this.sidecategory = catresult['data'];
          this.sizeOfProduct = info.sizeOfProduct;
        },
        error => {
          var info = JSON.parse(JSON.stringify(error));
        });
    this.userService.Apicommand('/brandList', this.data)
      .subscribe(
        brandresult => {
          this.brands = brandresult['data'];
        },
        error => {
          var info = JSON.parse(JSON.stringify(error));
        });
    if (this.cid == undefined && this.keyword == undefined) {
      this.activatedRouteSubscription = this.activatedRoute.params
        .subscribe(
          (p) => {
            let params: any = p;
            this.cid = (params['cid'] != '') ? params['cid'] : 0;
          },
          (err) => {
          });
    }
    if (this.bid == undefined && this.keyword == undefined) {
      this.activatedRouteSubscription = this.activatedRoute.params
        .subscribe(
          (p) => {
            let params: any = p;
            this.bid = (params['bid'] != '') ? params['bid'] : 0;
          },
          (err) => {
          });
    }
    this.data.categories = this.cid;
    this.data.brandids = this.bid;
    this.data.keyword = this.keyword;
    this.userService.Apicommand('/productfilter', this.data)
      .subscribe(
        result => {
          this.results = result['data'];
          this.link = result['product_img_link'];
          this.sizeOfProduct = result['sizeOfProduct'];
          this.colorOfProduct = result['colorOfProduct'];
          this.categoryname = result['categories'];
          this.getcategorycontent = result['category_content'];
          if(this.getcategorycontent['category_content'] !=''){
            this.categorycontent = this.getcategorycontent['category_content'];  
          }
          if(this.getcategorycontent['meta_title'] !='' && this.getcategorycontent['meta_title'] != 'null'){
            this.meta_title = this.getcategorycontent['meta_title'];
          }else{
            this.meta_title = this.categoryname;
          }
          if(this.getcategorycontent['meta_keyword'] !='' && this.getcategorycontent['meta_keyword'] != 'null'){
            this.meta_keyword = this.getcategorycontent['meta_keyword'];
          }else{
            this.meta_keyword = "";
          }
          if(this.getcategorycontent['meta_description'] !='' && this.getcategorycontent['meta_description'] != 'null'){
            this.meta_description = this.getcategorycontent['meta_description'];
          }else{
            this.meta_description = "";
          }
          this.titleService.setTitle(this.meta_title);
          this.meta.updateTag({name : 'keywords', content: this.meta_keyword});
          this.meta.updateTag({name : 'description', content: this.meta_description});
          let newArray1 = [];
          let newArray2 = [];
          result['data'].map(function (product) {
            if (!newArray2.includes(product['product_bname'])) {
              let narr = [];
              narr['id']=product['product_bname'];
              narr['name']=product['brand_name'];
              newArray2.push(product['product_bname']);
              newArray1.push(narr);
            }
          })
          this.newArray = newArray1
          if (result['data'].length > 11)
            this.page = result['page'];
          else
            this.page = 0;
        },
        error => {
          var info = JSON.parse(JSON.stringify(error));
        });
  }
  sorting(type, param) {
    this.filter = {};
    if (type == 'price') {
      this.filter.price = param;
      if (param == 'low') { this.SPL = 1; this.SPH = 0; this.SDL = 0; this.SDH = 0; }
      else { this.SPL = 0; this.SPH = 1; this.SDL = 0; this.SDH = 0; }
    }
    else if (type == 'discount') {
      this.filter.discount = param;
      if (param == 'low') { this.SPL = 0; this.SPH = 0; this.SDL = 1; this.SDH = 0; }
      else { this.SPL = 0; this.SPH = 0; this.SDL = 0; this.SDH = 1; }
    }
    this.searchrecord();
  }

  onChange(type, id, chk) {
    if (type == 'category') {
      if (chk.checked == true) {
        if (this.catId != '')
          this.catId += ',' + id;
        else
          this.catId = id;
      }
      else {
        if (this.uncatId != '')
          this.uncatId += ',' + id;
        else
          this.uncatId = id;
      }
    }
    if (type == 'brand') {
      if (chk.checked == true) {
        if (this.brandId != '')
          this.brandId += ',' + id;
        else
          this.brandId = id;
      }
      else {
        if (this.unbrandId != '')
          this.unbrandId += ',' + id;
        else
          this.unbrandId = id;
      }
    }
  }

  filtercheck(type, param) {
    if (type == 'discountpercent')
      this.dprecent = param;
  }
  searchrecord(click = '') {

    if(click=='yes'){
      //this.router.navigate(['/product']);
      this.keyword = '';
      //searchkeyword = '';
      this.paginations=0;
    }
    if (this.catId == "")
      this.catId = this.cid;
    if (this.brandId == "")
      this.brandId = this.bid;
    if (this.paginations == 0)
      this.results = [];
      this.price_lowhigh = '';
      this.data = {
        device_id: this.deviceId,
        device_type: '2',
        api_key: 'Safety%@t$',
        access_token: this.AccessToken,
        categories: this.catId,
        uncategories: this.uncatId,
        brandids: this.brandId,
        unbrandids: this.unbrandId,
        discountpercent: this.dprecent,
        filter: this.filter,
        paginations: this.paginations,
        keyword: this.keyword,
        price_min:this.rangeSliderMinValue,
        price_max:this.rangeSliderMaxValue
      };
    this.userService.Apicommand('/productfilter', this.data)
      .subscribe(
        result => {
          this.link = result['product_img_link'];
          this.categoryname = result['categories'];
          //console.log(result['categories']);
          this.page = result['page'];
          if (result['data'].length < 12)
            this.page = 0;
          const getdataCount = result['data'].length;
          for (let i = 0; i < getdataCount; ++i) {
            const item = result['data'][i];
            this.results.push({
              product_id: item.product_id,
              image: item.image,
              product_name: item.product_name,
              product_dprice: item.product_dprice,
              product_price: item.product_price,
              category_name: item.category_name,
              parent_category_name: item.parent_category_name
            });
          }
        },
        error => {
          var info = JSON.parse(JSON.stringify(error));
        });
  }

  pagination(page) {
    this.paginations = page;
    this.searchrecord();
  }

  // Add to Cart
  
  /*created code for add to cart*/
  addtocart(pid, qty, size, color, show) {
    if (show) {
      this.current_product_sizes = this.sizeOfProduct.filter((size) => {
        return size.fk_product_id === pid
      });
      this.current_product_colors = this.colorOfProduct.filter((color) => {
        return color.fk_product_id === pid
      });
      if (this.current_product_sizes.length || this.current_product_colors.length) {
        this.show = show
        this.product_id = pid;
        this.size = this.current_product_sizes.length ? this.current_product_sizes[0].size_value : ''
        this.color = this.current_product_colors.length ? this.current_product_colors[0].color_name : ''
        return;
      }
    }
    this.userdata = localStorage.getItem('userdata');
    if (this.userdata)
      this.session = JSON.parse(this.userdata);
    if (this.session.a_pincode != '' && this.session.a_pincode != null) {
      this.data = {
        device_id: this.deviceId,
        device_type: '2',
        api_key: 'Safety%@t$',
        access_token: this.AccessToken,
        uid: this.uids,
        product_id: pid,
        quantity: qty,
        size: size,
        color: color
      };
      this.userService.Cartcommand('/addtoCart', this.data)
        .subscribe(
          catresult => {
            var info = JSON.parse(JSON.stringify(catresult));
            const cartcounts = info.cartcount;
            localStorage.removeItem('cartcount');
            localStorage.setItem('cartcount', cartcounts);
            this.cartcount = localStorage.getItem('cartcount');
            //this.router.navigate(['/cart']);
            //location.reload();
          },
          error => {
            var info = JSON.parse(JSON.stringify(error));
          });
    } else {
      this.pincode_err = 'Something went wrong';
    }
  }
  /*created code end here*/

  onChangeToggle() {
    //console.log(this.sitetype);
    if (this.sitetype == true) {
      localStorage.setItem('sitetype', 'true');
      this.router.navigate(['service']);
    }
    else {
      //console.log('Else Site type');
      localStorage.setItem('sitetype', 'false');
      this.router.navigate(['/']);
    }
  }

  // Header Search
  headersearch() {
    this.data = { device_id: this.deviceId, device_type: '2', api_key: 'Safety%@t$', 'access_token': this.AccessToken, keyword: this.searchkeyword }
    this.userService.Apicommand('/productfilter', this.data)
      .subscribe(
        result => {
          this.catresults = result['data'];
        },
        error => {
          var info = JSON.parse(JSON.stringify(error));
        });
  }
  search_key() {
    let queryParam: any;
    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params.category != undefined) {
          queryParam = { category: params.category, keyword: this.searchkeyword };
        } else {
          queryParam = { keyword: this.searchkeyword };
        }
        //console.log(queryParam);
      });
    this.router.navigate(['/product/'], { queryParams: queryParam });
  }
}


