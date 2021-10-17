const { model, Schema } = require('mongoose');
const bcrypt = require('bcrypt');
const keygen = require('keygenerator');

const userSchema = new Schema({
  username: { type: String, required: true, lowercase: true },
  email: {
    unique: true,
    type: String,
    required: true,
    lowercase: true,
  },
  password: { type: String, required: true },
  secret_key: { type: String, default: () => keygen._(), immutable: true },
});

userSchema.pre('save', function (next) {
  let user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT), (err, salt) => {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      user.password = hash;

      next();
    });
  });
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = model('User', userSchema);
