import { computed } from '@nuxtjs/composition-api';
import { sharedRef, useVSFContext, Logger } from '@vue-storefront/core';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useBootstrap = () => {
  const context = useVSFContext();

  const menuItems = sharedRef(null, 'menuItems');
  const languages = sharedRef(null, 'languages');

  const loading = sharedRef(false, 'bootstrap-loading');

  const error = sharedRef({
    search: null
  }, 'bootstrap-error');

  const boot = async () => {
    Logger.debug('bootstrap/boot');

    try {
      loading.value = true;
      const lang = context.$prestashop.config.app.i18n.locales && context.$prestashop.config.app.i18n.locales.lenght > 1 ? '/' + context.$prestashop.config.app.$cookies.get('vsf-locale') : '';
      const { data, cookieObject } = await context.$prestashop.api.bootstrap({ lang: lang });
      error.value.boot = null;

      if (data.code === 200) {
        menuItems.value = data.psdata.menuItems;
        languages.value = data.psdata.languages.languages;

        const vsfCookieKey = context.$prestashop.config.app.$config.psCustomerCookieKey;
        const vsfCookieValue = context.$prestashop.config.app.$config.psCustomerCookieValue;

        const psCookieKey = context.$prestashop.config.app.$cookies.get(vsfCookieKey);
        const psCookieValue = context.$prestashop.config.app.$cookies.get(vsfCookieValue);

        if (cookieObject && !psCookieKey && !psCookieValue) {
          context.$prestashop.config.app.$cookies.set(vsfCookieKey, cookieObject.vsfPsKeyCookie);
          context.$prestashop.config.app.$cookies.set(vsfCookieValue, cookieObject.vsfPsValCookie);
        }
        return data;
      }
    } catch (err) {
      error.value.boot = err;
      Logger.error('bootstrap/boot', err);
    } finally {
      loading.value = false;
    }
  };
  return {
    boot,
    menuItems: menuItems,
    languages: languages,
    loading: computed(() => loading.value),
    error: computed(() => error.value)
  };
};
