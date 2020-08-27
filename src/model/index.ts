import { Sequelize } from 'sequelize-typescript';
import { CustomerModel } from '../components/customer/Model';

export const addModels = (seq: Sequelize) => {
  seq.addModels([CustomerModel]);
};
