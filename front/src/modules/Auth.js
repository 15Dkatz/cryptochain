class Auth {

  /**
  * Authenticate a user, save a token string in Local Storage
  * @param {string} token
  */
  static authenticate(token) {
    localStorage.setItem('jwt', token);
  }

  /**
   * Check if a user is authenticated - check if a token is saved in Local Storage
   *
   * @returns {boolean}
   */
   static isAuthenticate() {
     return localStorage.getItem('jwt') !== null;
   }

   /**
   * logout a user. Remove a token from Local Storage.
   *
   */
   static logout() {
     localStorage.removeItem('jwt');
   }
}

export default Auth;
