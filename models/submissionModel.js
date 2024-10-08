import sequelize from '../config/database.js';
import { UUIDV4, DataTypes, UUID } from "sequelize";

 
export const Submission = sequelize.define(
    "Submission",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      assignment_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      submission_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      submission_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
      },
      submission_updated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      retry_count:{
        type: DataTypes.INTEGER,
        defaultValue: 0, 
        allowNull: false,
      },
     
    },
    {
      tableName: "submissions", 
      timestamps: true,
    }
  );
  
