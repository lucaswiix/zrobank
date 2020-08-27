import { Sequelize } from 'sequelize-typescript';
import { CustomerModel } from '../components/customer/Model';
import { PropertyModel } from '../components/property/Model';
import { RatingModel } from '../components/rating/Model';

export const addModels = (seq: Sequelize) => {
  seq.addModels([CustomerModel, PropertyModel, RatingModel]);
};
