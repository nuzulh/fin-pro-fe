// import { addLocaleData } from 'react-intl';
import enLang from './entries/en-US';
import enRtlLang from './entries/en-US-rtl';
import idLang from './entries/id-ID';

// import {createIntl, createIntlCache, RawIntlProvider} from 'react-intl'

// // This is optional but highly recommended
// // since it prevents memory leak
// const cache = createIntlCache()

// const intl = createIntl({
//   locale: 'fr-FR',
//   messages: {}
// }, cache)

const AppLocale = {
  en: enLang,
  enrtl: enRtlLang,
  id: idLang,
};
// addLocaleData(AppLocale.en.data);
// addLocaleData(AppLocale.es.data);
// addLocaleData(AppLocale.enrtl.data);

export default AppLocale;
