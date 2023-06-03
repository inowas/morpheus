const reactI18Next = jest.createMockFromModule('react-i18next');

reactI18Next.useTranslation = () => ({
  initReactI18next: {},
  t: (str) => str,
  i18n: {
    changeLanguage: () => new Promise(() => {
    }),
    use: () => this,
    init: () => {
    },
    language: 'en',
  },
});

module.exports = reactI18Next;

export default {};

