import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { loaderInterceptor } from './loader.interceptor';
import { LoadingService } from '../services/loading.service';

describe('loaderInterceptor', () => {
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;

  const interceptor: HttpInterceptorFn = (req, next) => 
    TestBed.runInInjectionContext(() => loaderInterceptor(req, next));

  beforeEach(() => {
    loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);
    TestBed.configureTestingModule({
      providers: [
        { provide: LoadingService, useValue: loadingServiceSpy }
      ]
    });
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should show loading before forwarding the request', () => {
    const request = new HttpRequest('GET', '/heroes');
    const next: HttpHandlerFn = () => of(new HttpResponse({ status: 200 }));

    interceptor(request, next).subscribe();

    expect(loadingServiceSpy.show).toHaveBeenCalled();
  });

  it('should hide loading when request stream completes', fakeAsync(() => {
    const request = new HttpRequest('GET', '/heroes');
    const next: HttpHandlerFn = () => of(new HttpResponse({ status: 200 }));

    interceptor(request, next).subscribe();
    tick(500);

    expect(loadingServiceSpy.hide).toHaveBeenCalled();
  }));
});
