import fs from 'node:fs';
import dotenv from 'dotenv';
import DBClient from './db';
import Category from '../models/category';
import Subcategory from '../models/subcategory';

dotenv.config();

/**
   * Add categories to database from an excel or csv file
   * @param {string} file - filepath to categories file
   */
async function addCategories(file) {
  if (!fs.existsSync(file)) {
    console.error("Categories file doesn't exist");
    return;
  }
  const saveDocuments = [];
  const data = fs.readFileSync(file).toString('utf-8');
  const categories = data.split('\n');
  for (const category of categories.slice(1, categories.length - 1)) {
    const newCategory = new Category({ title: category });
    saveDocuments.push(newCategory.save());
  }
  await Promise.all(saveDocuments);
}

/**
   * Add subcategories to database from an excel or csv file
   * @param {string} file - filepath to subcategories file
   */
async function addSubcategories(file) {
  if (!fs.existsSync(file)) {
    console.error("Subcategories file doesn't exist");
    return;
  }
  const saveDocuments = [];
  const data = fs.readFileSync(file).toString('utf-8');
  const subcategories = data.split('\n');
  for (const subcategory of subcategories.slice(1, subcategories.length - 1)) {
    const [title, categoryTitle, keywords] = subcategory.split(',');
    // eslint-disable-next-line no-await-in-loop
    const category = await Category.findOne({ title: categoryTitle });
    if (category) {
      const newSubcategory = new Subcategory({
        title,
        category,
        keywords: keywords.split(';').map((keyword) => keyword.toLowerCase()),
      });
      saveDocuments.push(newSubcategory.save());
    }
  }
  await Promise.all(saveDocuments);
}

/**
 * Populates database with categories and subcategories from csv files
 */
async function loadCategories() {
  const categoriesFile = './shared/course_categories.csv';
  const subCategoriesFile = './shared/course_subcategories.csv';
  try {
    await DBClient.connect();
    await Category.deleteMany({});
    await Subcategory.deleteMany({});
    await addCategories(categoriesFile);
    await addSubcategories(subCategoriesFile);
  } catch (error) {
    console.error(error);
  }
}

loadCategories().then(() => process.exit());