const { User } = require('../../model/models_user.js');

async function createUser() {
  try {
    const user = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      gender: 'M',
      email: 'johndoe@example.com',
    });
    console.log('User created:', user.toJSON());
  } catch (error) {
    console.error('Error creating user:', error);
  }
}
createUser();