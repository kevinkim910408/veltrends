class UserService {
  private static instance: UserService
  public static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService()
    }
    return UserService.instance
  }

  register() {
    return 'register'
  }
  login() {
    return 'login'
  }
}

export default UserService
