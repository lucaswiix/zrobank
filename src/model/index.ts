import { Sequelize } from 'sequelize-typescript';
import { CustomerModel } from '../components/customer/Model';
import { PropertyModel } from '../components/property/Model';

export const addModels = (seq: Sequelize) => {
  seq.addModels([CustomerModel, PropertyModel]);
};
