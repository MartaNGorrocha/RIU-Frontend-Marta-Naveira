import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { heroResolver } from './hero.resolver';

describe('heroResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => heroResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
