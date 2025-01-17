import {
  Context,
  useMakeOrderFactory,
  UseMakeOrderFactoryParams
} from '@vue-storefront/core';
import type { Order } from '@vue-storefront/prestashop-api';

const factoryParams: UseMakeOrderFactoryParams<Order> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  make: async (context: Context, params) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { methodName } = params;
    const vsfCookieKey = context.$prestashop.config.app.$config.psCustomerCookieKey;
    const vsfCookieValue = context.$prestashop.config.app.$config.psCustomerCookieValue;

    const psCookieKey = context.$prestashop.config.app.$cookies.get(vsfCookieKey);
    const psCookieValue = context.$prestashop.config.app.$cookies.get(vsfCookieValue);

    const { data, cookieObject } = await context.$prestashop.api.makeOrder({ methodName: methodName, psCookieKey, psCookieValue });
    if (data.code === 200) {
      if (cookieObject) {
        context.$prestashop.config.app.$cookies.set(vsfCookieKey, cookieObject.vsfPsKeyCookie);
        context.$prestashop.config.app.$cookies.set(vsfCookieValue, cookieObject.vsfPsValCookie);
      }
      return data.psdata;
    } else {
      return {};
    }
  }
};

export const useMakeOrder = useMakeOrderFactory<Order>(factoryParams);
