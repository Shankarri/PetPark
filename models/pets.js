module.exports = function (sequelize, DataTypes) {
  var Pet = sequelize.define("Pet", {
    name: {
      type: DataTypes.STRING,
      validate: {
        len: [1, 140],
      },
    },
    img: {
      type: DataTypes.STRING,
    },
    alive: {
      type: DataTypes.BOOLEAN,
      defaultValue: 1,
    },
    hp: {
      type: DataTypes.INTEGER,
      defaultValue: 3,
    },
    hungry: {
      type: DataTypes.INTEGER,
      validate:{
        max: 5,
      },
      defaultValue: 5,

    },
    sleepy: {
      type: DataTypes.INTEGER,
      validate:{
        max: 5,
      },
      defaultValue: 5,

    },
    happy: {
      type: DataTypes.STRING,
      validate:{
        max: 5,
      },
      defaultValue: 5,

    },
    lastFed: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    lastSlept: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    lastPlayed: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }


  });

  Pet.associate = function (models) {
    models.Pet.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Pet;
};