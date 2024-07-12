import { Injectable } from '@nestjs/common';
import {
  CacheModuleOptions,
  CacheOptionsFactory,
} from '@nestjs/common/cache/interfaces/cache-module.interface';

@Injectable()
export class CacheFactory implements CacheOptionsFactory {
  createCacheOptions(): CacheModuleOptions {
    return {
      ttl: 5, // seconds
      max: 10, // maximum number of items in cache
    };
  }
}
