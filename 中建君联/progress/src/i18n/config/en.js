import enLocale from 'element-ui/lib/locale/lang/en';

const en = {
    errorCode: {
      20001001: 'Wrong account or password',
      40001005: 'Password verification failed'
    },
    globalData: {
      browserTitle: '',
      currentLanguage: 'English',
      noData: 'Temporarily no data',
      serialNumber: 'number',
      putItAway: 'Put it away',
      open: 'open',
      tips: 'Tips',
      signOut: 'sign out',
      exitTheSystem: 'Exit the system'
    },
    login: {
      title: 'Welcome to the construction management cloud',
      systemTitle: 'Welcome to the rapid development platform',
      logIn: 'Login',
      username: 'phone/Account number/email',
      usernameErrorTips: 'Mobile number / Account / email cannot be empty',
      password: 'password',
      passwordErrorTips: 'Password cannot be empty',
      rememberPassword: 'remember password',
      forgetPassword: 'forget password',
      footer: 'Copyright: junny | Firefox and Google are recommended | ICP No. 18134766'
    },
    ...enLocale
};
export default en;
