'use strict';
const {
  Model
} = require('sequelize');
const {hashPassword} = require('../helpers/hash-password');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Todo);
    }
  };
  User.init({
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate : {
        isEmail : {
          args : true,
          msg : 'email has an @'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [6,100],
          msg: "Password must be at least 6 characters"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (instances, opt) => {
        instances.password = hashPassword(instances.password);
      }
    }
  });
  return User;
};