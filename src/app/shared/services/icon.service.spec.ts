import {TestBed} from '@angular/core/testing';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {iconsConfig} from '../configs/icons.config';
import {IconService} from './icon.service';

describe('IconService', () => {
  let service: IconService;
  let matIconRegistrySpyObj: jasmine.SpyObj<MatIconRegistry>;
  let domSanitizerSpyObj: jasmine.SpyObj<DomSanitizer>;

  beforeEach(() => {
    matIconRegistrySpyObj = jasmine.createSpyObj('MatIconRegistry', ['addSvgIcon']);
    domSanitizerSpyObj = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']);
    domSanitizerSpyObj.bypassSecurityTrustResourceUrl.and.callFake((path) => path);

    TestBed.configureTestingModule({
      providers: [
        IconService,
        {provide: MatIconRegistry, useValue: matIconRegistrySpyObj},
        {provide: DomSanitizer, useValue: domSanitizerSpyObj},
      ],
    });
    service = TestBed.inject(IconService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize all icons', () => {
    service.initIcons();
    expect(matIconRegistrySpyObj.addSvgIcon).toHaveBeenCalledTimes(iconsConfig.length);
  });

  iconsConfig.forEach((config) => {
    it(`should add icon with id '${config.id}' to the mat icon registry`, () => {
      service.initIcons();

      expect(domSanitizerSpyObj.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(config.path);
      expect(matIconRegistrySpyObj.addSvgIcon).toHaveBeenCalledWith(config.id, jasmine.anything());
    });
  });
});
