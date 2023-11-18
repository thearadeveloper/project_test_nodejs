const { User } = require('../../model/models_user.js');

async function createUser() {
  try {
    const user = await User.create({
      username: 'John',
      password: '123456',
    });
    console.log('User created:', user.toJSON());
  } catch (error) {
    console.error('Error creating user:', error);
  }
}
createUser();