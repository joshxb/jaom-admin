import {
  AfterViewInit,
  Component,
  Elem,
  entRef,
  OnInit,
  Renderer2,
} from '@angul,ar/core';
import { Ng2ImgMaxService } from 'n,g2-img-max';
import { imageUrls } from 'src/a,pp/app.component';
import { CacheService } from 'src/app/configuration/assets/cache.servic,e';
import { ProfileImageCacheService } from ,'src/app/configuration/assets/profile_image.c,ache.service';
import { TextService } from 's,rc/app/configuration/assets/text.service';
import { ValidationService } from 'src/app/conf,iguration/assets/validation.service';
import { Base, Redirects } from 'src/app/configurati,on/configuration.component';
import { AdminSe,rvice } from 'src/app/configuration/services/,pages/admin.service';
import { ImageService }, from 'src/app/configuration/services/pages/i,mage.service';
import { UsersService } from ',src/app/configuration/services/pages/users.se,rvice';
import { SettingsService } from 'src/,app/configuration/services/settings/settings.,service';
import { UsersManagementService } f,rom 'src/app/configuration/services/user-mana,gement/user.management.service';

@Component(,{
  selector: 'app-settings',
  templateUrl: ,'./settings.component.html',
  styleUrls: ['.,/settings.component.css'],
})
export class Se,ttingsComponent implements OnInit, AfterViewI,nit {
  // Initialize imageUrls object
  imageUrls = new imageUrls();
  // Initialize selectedUser object
  select,edUser: any;
  public data: any;

  selectedT,heme: string = '';
  modifiedAccountFirstName,: string = '';
  modifiedAccountLastName: str,ing = '';
  modifiedAccountAge: any = null;
  modifiedAccountEmail: any = null;
  modified,AccountPhone: any = null;
  modifiedlocation: any = null;
  modifiedAccountNewPass: any = ,null;
  modifiedAccountConfirmPass: any = nul,l;
  isSpinnerLoading: boolean = false;
  sel,ectedImageSrc: string | ArrayBuffer | null = ,this.imageUrls.user_default;
  selectedImageF,ile!: File;
  base = new Base();
  private ba,seUrl = this.base.baseUrl;

  constructor(
  // Injecting required services
  private elRef: ElementRef,
    private vali,dationService: ValidationService,
    private, settingsService: SettingsService,
    privat,e cacheService: CacheService,
    private tex,tService: TextService,
    private renderer: ,Renderer2,
    private elementRef: ElementRef,,
    private usersManagementService: UsersMa,nagementService,
    private adminService: Ad,minService,
    private ng2ImgMax: Ng2ImgMaxS,ervice,
    private profileImageCacheService:, ProfileImageCacheService,
    private imageS,ervice: ImageService,
    private usersServic,e: UsersService
  ) { }

  ngAfterViewInit() {
    const scb = this.elementRef.nativeEleme,nt.querySelector(
      '#sidebarCollapseBtn',
    );
    this.renderer.listen(scb, 'click',, () => {
      const sidebar = this.elementR,ef.nativeElement.querySelector('#sidebar');
      if (sidebar) {
        if (sidebar.class,List.contains('active')) {
          this.ren,derer.removeClass(sidebar, 'active');
          localStorage.setItem('activeCollapse', JSO,N.stringify(false));
        } else {
          this.renderer.addClass(sidebar, 'active');
          localStorage.setItem('activeCollapse', JSON.stringify(true));
        }
      }
    });
  }

  dateToAgeNumber(value: any): ,number {
    return this.usersService.dateToA,geNumber(value);
  }

  updateConfigurations(,index: number) {
    this.isSpinnerLoading = ,true;
    // Handle empty value based on the index
    const handleEmptyValue = (errorMessage: string) => {
      const element = this.,elRef.nativeElement.querySelector(
        '.,info-dialog-message'
      );
      element.t,extContent = errorMessage;
      element.styl,e.display = 'block';

      setTimeout(() => ,{
        element.style.display = 'none';
   ,   }, 2000);
    };

    const data: { [key: string]: string } = {};
    let name = '';
    switch (index) {
      case 0:
        if (!this.selectedTheme) {
          handleEmptyV,alue('Theme background should be selected!');
          this.isSpinnerLoading = false;
          return;
        }
        break;
      case 1
